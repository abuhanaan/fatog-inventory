import { RxDashboard } from "react-icons/rx";
import { FaPeopleCarryBox, FaUsersGear, FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdFormatListBulleted, MdInventory, MdHistory } from "react-icons/md";
import { RiStockFill } from "react-icons/ri";
import { TbShoppingCartCog } from "react-icons/tb";

export const links = [
    {title: 'Dashboard', ref: '/dashboard', icon: RxDashboard},
    {title: 'Users', ref: '/users', icon: FaUsersGear},
    {title: 'Products', ref: '/products', icon: MdFormatListBulleted},
    {title: 'Manufacturers', ref: '/manufacturers', icon: FaPeopleCarryBox},
    {title: 'Inventories', ref: '/inventories', icon: MdInventory},
    {title: 'Stocks', ref: '/stocks', icon: RiStockFill},
    {title: 'Orders', ref: '/orders', icon: TbShoppingCartCog},
    {title: 'Sales', ref: '/sales', icon: FaMoneyBillTrendUp},
]