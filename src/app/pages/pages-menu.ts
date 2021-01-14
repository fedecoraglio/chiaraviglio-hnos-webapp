import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Cuenta',
    icon: 'nb-home',
    link: '/pages/current-account',
    home: true,
    children: [
      {
        title: 'Movimientos Cta Cte',
        link: '/pages/current-account',
      },
      {
        title: 'Movimientos de Granos',
        link: '/pages/grain-account',
      },
      {
        title: 'Movimientos de Acopios',
        link: '/pages/grain-store',
      },
    ],
  },
  {
    title: 'Perfil',
    icon: 'nb-compose',
    children: [
      {
        title: 'Actualizar Datos',
        link: '/pages/user-update',
      },
      {
        title: 'Cambiar Contraseña',
        link: '/pages/reset-pwd',
      },
    ],
  },
  {
    title: 'Cerrar Sessión',
    icon: 'nb-locked',
    link: '/auth/logout',
  },
];
