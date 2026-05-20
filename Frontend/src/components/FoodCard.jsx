import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Plus, ShoppingBag } from 'lucide-react';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`, {
      style: {
        borderRadius: '1rem',
        background: '#5D2E17',
        color: '#fff',
        fontWeight: 'bold'
      },
    });
  };

  return (
    <div className="group bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full hover:-translate-y-2">
      <div className="h-64 overflow-hidden relative">
        <img
          src={food.image.startsWith('/') ? food.image : `/${food.image}`}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary font-black px-4 py-2 rounded-2xl text-sm shadow-lg">
          Rs. {food.price}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
           <span className="text-white text-xs font-black uppercase tracking-widest bg-accent px-3 py-1 rounded-full">
            {food.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black text-primary mb-3 group-hover:text-accent transition-colors">{food.name}</h3>
        <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{food.description}</p>
        
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-cream hover:bg-accent hover:text-white text-primary py-4 rounded-2xl flex items-center justify-center transition-all duration-300 font-black tracking-tighter shadow-sm hover:shadow-lg hover:shadow-accent/30 group/btn"
          >
            <ShoppingBag size={20} className="mr-2 transform group-hover/btn:scale-110 transition-transform" /> 
            ADD TO ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
