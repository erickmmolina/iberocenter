export function validateEmail(email: string): string | null {
  if (!email) return 'El email es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'El email no es válido';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return 'El nombre es requerido';
  if (name.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  return null;
}

export function validateTaxId(taxId: string): string | null {
  if (!taxId) return 'El RUT/NIF es requerido';
  return null;
}

export function validateCompanyName(name: string): string | null {
  if (!name) return 'El nombre de la empresa es requerido';
  if (name.length < 2) {
    return 'El nombre de la empresa debe tener al menos 2 caracteres';
  }
  return null;
}