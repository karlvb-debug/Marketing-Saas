'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

export async function sendCampaign(formData: FormData) {
  const supabase = await createClient()
  
  const subject = formData.get('subject') as string
  const content = formData.get('content') as string
  const workspaceId = formData.get('workspaceId') as string

  if (!subject || !content || !workspaceId) {
    return { error: 'Missing required fields' }
  }

  // 1. Fetch all unique email contacts in this workspace
  const { data: contacts, error: contactError } = await supabase
    .from('contacts')
    .select('email, first_name')
    .eq('workspace_id', workspaceId)
    .eq('unsubscribed', false)
    .not('email', 'is', null)

  if (contactError || !contacts || contacts.length === 0) {
    console.error("Contact fetch error:", contactError)
    return { error: 'No valid contacts found in this workspace.' }
  }

  // Extract just the email string array 
  // Note: For large lists in production, Resend's Batch API should be used, or a queue.
  // For this MVP, we will send to a batch of up to 50 using resend.emails.send() with multiple 'to' fields
  // or iterating. Sandbox requires 'onboarding@resend.dev' sender.
  const toEmails = contacts.map(c => c.email)

  // 2. Insert Campaign Log (Status = 'sending')
  const { data: campaign, error: insertError } = await supabase
    .from('campaigns')
    .insert([{
      workspace_id: workspaceId,
      name: `Email Blast - ${new Date().toLocaleDateString()}`,
      type: 'email',
      status: 'sending',
      subject: subject,
      content: content
    }])
    .select()
    .single()

  if (insertError) {
    console.error("Campaign insert error:", insertError)
    return { error: 'Database failed to register campaign' }
  }

  // 3. Dispatch Emails via Resend Server API
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  try {
    // We send individual emails or we use BCC depending on architecture. 
    // In Resend sandbox, we can only send to verified emails (or the email associated with the Resend account).
    for (const email of toEmails) {
      if (!email) continue;
      
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // MUST use onboarding@resend.dev for unverified domains
        to: email,
        subject: subject,
        html: `<div>
                 <h1>${subject}</h1>
                 <p>${content.replace(/\n/g, '<br />')}</p>
                 <br />
                 <small>You are receiving this email from a Marketing MVP test.</small>
               </div>`
      })

      if (error) {
         console.error(`Resend API error for ${email}:`, error);
      }
    }
    
    // 4. Update Campaign Status to 'completed'
    await supabase
      .from('campaigns')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', campaign.id)

  } catch (err) {
    console.error('Failed to send Resend email completely', err)
    
    await supabase
      .from('campaigns')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', campaign.id)
  }

  revalidatePath('/')
}
