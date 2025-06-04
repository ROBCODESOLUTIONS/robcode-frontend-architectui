const token = JSON.parse(localStorage.getItem("token"));
if(token === null) {
    window.location.href = "/#/pages/login";
}
console.table(token);
const role = token.user.roles[0]?.name;

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
    {
        icon: 'pe-7s-rocket',
        label: 'Recursos',
        to: '#/pages/dashboard/resources',
        roles: "admin,Teacher,Student",
    },
    {
        icon: 'pe-7s-rocket',
        label: 'Juegos Interactivos',
        to: '#/pages/dashboard/games',
        roles: "admin,Teacher,Student",
    },
    {
        icon: 'pe-7s-photo',
        label: 'Material de apoyo',
        to: '#/pages/dashboard/material',
        roles: "admin,Teacher,Student",
    },
    {
        icon: 'pe-7s-display2',
        label: 'Acerca de',
        to: '#/pages/dashboard/about',
        roles: "admin,Teacher,Student",
    }
];

const MainNavItems = MainNavBase.filter((item) => {
    item.roles = item.roles.split(",");
    return item.roles.includes(role);
});
export const UpgradeNav = [];

export const MainNav = MainNavItems.length > 0 ? MainNavItems : [{
    icon: 'pe-7s-coffee',
    label: 'Inicio',
    to: '#/pages/dashboard/main',
}];

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