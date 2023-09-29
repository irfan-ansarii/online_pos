import Cart from "./components/Cart";
import Products from "./components/Products";
import CartDrawer from "./components/CartDrawer";
const Page = () => {
  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-background">
          <CartDrawer />
          <Products />
        </div>
        <div className="hidden lg:block -mr-4 p-4 lg:col-span-6 xl:col-span-5 2xl:col-span-4 sticky bg-accent h-screen top-0 bottom-0 z-50">
          <Cart />
        </div>
      </div>
    </main>
  );
};

export default Page;
