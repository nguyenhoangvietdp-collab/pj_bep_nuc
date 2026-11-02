import {redirect} from "next/navigation";
export default function Flowers(){redirect("/meals?category="+encodeURIComponent("Hoa cắm nhà"));}
