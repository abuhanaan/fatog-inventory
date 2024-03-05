import { RxDashboard } from "react-icons/rx";
import { FaPeopleCarryBox, FaUsersGear } from "react-icons/fa6";
import { MdFormatListBulleted, MdInventory } from "react-icons/md";

export const links = [
    {title: 'Dashboard', ref: '/dashboard', icon: RxDashboard},
    {title: 'Users', ref: '/users', icon: FaUsersGear},
    {title: 'Products', ref: '/products', icon: MdFormatListBulleted},
    {title: 'Manufacturers', ref: '/manufacturers', icon: FaPeopleCarryBox},
    {title: 'Inventories', ref: '/inventories', icon: MdInventory},
]