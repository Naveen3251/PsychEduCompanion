import Navbar from "@/components/navbar";
import { Provider } from "@/components/providers";
import Sidebar from "@/components/sidebar";
//ui
import { Toaster } from "@/components/ui/toaster";

const RootLayout = ({
    children
}:{
    children:React.ReactNode;
}) => {
    return ( 
        <Provider>
       
        <div className="h-full">
            <Navbar/>
            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar/>
            </div>
            <main className="md:pl-20 pt-16 h-full">
                {children}
                <Toaster/>
            </main>
            
        </div>
        </Provider>
     );
}
 
export default RootLayout;