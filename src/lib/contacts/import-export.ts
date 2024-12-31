import { Contact } from './types';
import { supabase } from '../supabase';
import { useAuth } from '../auth';

export async function exportContacts(): Promise<string> {
  const { user } = useAuth.getState();
  if (!user) throw new Error('Usuario no autenticado');

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (error) throw error;

  const csv = [
    ['Nombre', 'Teléfono', 'Email', 'Empresa', 'Ciudad', 'Notas'].join(','),
    ...contacts.map(contact => [
      contact.name,
      contact.phone,
      contact.email || '',
      contact.company || '',
      contact.city || '',
      (contact.notes || '').replace(/,/g, ';')
    ].join(','))
  ].join('\n');

  return csv;
}

export async function importContacts(file: File): Promise<void> {
  const { user } = useAuth.getState();
  if (!user) throw new Error('Usuario no autenticado');

  const text = await file.text();
  const rows = text.split('\n').slice(1); // Skip header row

  const contacts = rows.map(row => {
    const [name, phone, email, company, city, notes] = row.split(',');
    return {
      user_id: user.id, // Add user_id to each contact
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      company: company.trim() || null,
      city: city.trim() || null,
      notes: notes.trim() || null
    };
  });

  // Insert contacts in batches to avoid timeouts
  const batchSize = 50;
  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);
    const { error } = await supabase.from('contacts').insert(batch);
    if (error) throw error;
  }
}