const MainNavBase = [
    {
        icon: 'pe-7s-coffee',
        label: 'Inicio',
        to: '#/pages/dashboard/main',
        roles: "admin,Teacher,Student",
    },
    {
        icon: 'pe-7s-culture',
        label: 'Entidades',
        to: '#/pages/dashboard/entities',
        roles: "admin",
    },
    {
        icon: 'pe-7s-world',
        label: 'Cursos',
        to: '#/pages/dashboard/courses',
        roles: "admin,Teacher",
    },
    {
        icon: 'pe-7s-users',
        label: 'Instructores',
        to: '#/pages/dashboard/teachers',
        roles: "admin",
    },
    {
        icon: 'pe-7s-users',
        label: 'Estudiantes',
        to: '#/pages/dashboard/students',
        roles: "admin",
    },
    // {
    //     icon: 'pe-7s-rocket',
    //     label: 'Recursos',
    //     to: '#/pages/dashboard/resources',
    //     roles: "admin,Teacher,Student",
    // },
    {
        icon: 'pe-7s-rocket',
        label: 'Contenido Educativo',
        to: '#/pages/dashboard/content',
        roles: "admin,Teacher,Student",
    },
    // {
    //     icon: 'pe-7s-rocket',
    //     label: 'Juegos Interactivos',
    //     to: '#/pages/dashboard/games',
    //     roles: "admin,Teacher,Student",
    // },
    // {
    //     icon: 'pe-7s-photo',
    //     label: 'Material de apoyo',
    //     to: '#/pages/dashboard/material',
    //     roles: "admin,Teacher,Student",
    // },
    {
        icon: 'pe-7s-display2',
        label: 'Acerca de',
        to: '#/pages/dashboard/about',
        roles: "admin,Teacher,Student",
    }
];

// El menú depende del rol del usuario autenticado, que puede cambiar entre
// sesiones (admin -> Teacher -> Student) sin recargar la página. Por eso se
// recalcula en cada llamada en vez de quedar fijado al importar el módulo,
// que era lo que dejaba visibles secciones administrativas tras cambiar de
// usuario.
export const getMainNav = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const role = token?.user?.roles?.[0]?.name;

    const items = MainNavBase
        .map((item) => ({ ...item, roles: item.roles.split(",") }))
        .filter((item) => item.roles.includes(role));

    return items.length > 0 ? items : [{
        icon: 'pe-7s-coffee',
        label: 'Inicio',
        to: '#/pages/dashboard/main',
    }];
};

export const UpgradeNav = [];

export const ComponentsNav = [
];
export const FormsNav = [
];
export const WidgetsNav = [
    // {
    //     icon: 'pe-7s-graph2',
    //     label: 'Dashboard Boxes',
    //     to: '#/widgets/chart-boxes-3',
    // },
];
export const ChartsNav = [
    // {
    //     icon: 'pe-7s-graph2',
    //     label: 'ChartJS',
    //     to: '#/charts/chartjs',
    // },
];