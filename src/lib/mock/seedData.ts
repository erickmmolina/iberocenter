import { supabase } from '../supabase';
import { AuthLogger } from '../auth/logger';

const mockCompany = {
  name: 'Empresa Demo',
  tax_id: '12345678-9'
};

const mockProfile = {
  name: 'Usuario Demo',
  email: 'demo@example.com',
  role: 'admin',
  avatar_url: null
};

export async function seedInitialData(userId: string) {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      return; // Data already exists
    }

    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert(mockCompany)
      .select()
      .single();

    if (companyError) throw companyError;

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        company_id: company.id,
        ...mockProfile
      });

    if (profileError) throw profileError;

    // Create notifications table if it doesn't exist
    await supabase.rpc('create_notifications_if_not_exists');

    // Create some mock notifications
    const { error: notificationsError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type: 'voicemail',
          contact_name: 'Juan Pérez',
          contact_number: '+56912345678',
          read: false
        },
        {
          user_id: userId,
          type: 'voicemail_abandoned',
          contact_name: 'María García',
          contact_number: '+56987654321',
          read: false
        }
      ]);

    if (notificationsError && notificationsError.code !== '42P01') {
      throw notificationsError;
    }

  } catch (error) {
    AuthLogger.error('Error seeding initial data', error);
    // Continue even if seeding fails
  }
}