interface IRoles {
  superAdmin: string,
  admin: string,
  manager: string,
  employee: string,
  vendor: string,
  client: string;
}

export const roles: IRoles = {
  superAdmin: 'SUPER_ADMIN',
  admin: 'ADMIN',
  manager: 'MANAGER',
  employee: 'EMPLOYEE',
  vendor: 'VENDOR',
  client: 'CLIENT'
};