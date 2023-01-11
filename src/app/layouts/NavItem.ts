export interface IMenu {
  text: string,
  icon: string,
  routerLink: string;
  children: IMenu[] | null
}

export const navItem : IMenu[] = [
  {
    text : "navigation.dashboard",
    icon : "home",
    routerLink: "/dashboard",
    children : null
  },
  {
    text : "navigation.profile",
    icon : "person",
    routerLink: "/profile",
    children : [
      {
        text : "navigation.settings",
        icon : "settings",
        routerLink: "/profile/settings",
        children : null
      },
    ]
  },
  {
    text : "navigation.manage",
    icon : "people",
    routerLink: "/manage",
    children : [
      {
        text : "navigation.users",
        icon : "supervisor_account",
        routerLink: "/manage/users",
        children : null
      },
      {
        text : "navigation.roles",
        icon : "bubble_chart",
        routerLink: "/manage/roles",
        children : null
      },
      {
        text : "navigation.category",
        icon : "category",
        routerLink: "/manage/category",
        children : null
      },
      {
        text : "navigation.administrativeUnit",
        icon : "category",
        routerLink: "/manage/administrative-unit",
        children : null
      },
      {
        text : "navigation.product",
        icon : "toys",
        routerLink: "/manage/product",
        children : null
      },
      {
        text : "navigation.warehouse",
        icon : "bubble_chart",
        routerLink: "/manage/warehouse",
        children : null
      },
    ]
  },
  {
    text : "navigation.import",
    icon : "cloud_download",
    routerLink: "/importOrder",
    children : [
      {
        text : "navigation.publisher",
        icon : "person_pin",
        routerLink: "/import/publisher",
        children : null
      },
    ]
  },
]
