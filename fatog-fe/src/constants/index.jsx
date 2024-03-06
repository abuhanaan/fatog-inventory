import { RxDashboard } from "react-icons/rx";
import { FaPeopleCarryBox, FaUsersGear } from "react-icons/fa6";
import { MdFormatListBulleted, MdInventory, MdHistory } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { RiStockFill } from "react-icons/ri";

export const links = [
    {title: 'Dashboard', ref: '/dashboard', icon: RxDashboard},
    {title: 'Users', ref: '/users', icon: FaUsersGear},
    {title: 'Products', ref: '/products', icon: MdFormatListBulleted},
    {title: 'Manufacturers', ref: '/manufacturers', icon: FaPeopleCarryBox},
    {title: 'Inventories', ref: '/inventories', icon: MdInventory},
    {title: 'Stocks', ref: '/stocks', icon: RiStockFill},
    {title: 'History', ref: '/history', icon: LuHistory},
]