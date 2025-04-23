"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAuthCookies } from "@/lib/cookies";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { useAddProduct, useProductList } from "@/app/services/products";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDataState, setFormDataState] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    image: null as File | null,
  });
  const { userRole } = getAuthCookies();
  const { data: productsData, isLoading } = useProductList();
  const { mutate: addProduct, isLoading: isAdding } = useAddProduct();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('product_name', formDataState.product_name);
    formData.append('product_description', formDataState.product_description);
    formData.append('product_price', formDataState.product_price);
    if (formDataState.image) {
      formData.append('image', formDataState.image);
    }

    addProduct(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormDataState({
          product_name: "",
          product_description: "",
          product_price: "",
          image: null,
        });
        queryClient.invalidateQueries({ queryKey: ["productList"] });
        toast.success("Product added successfully!");
      },
      onError: () => {
        toast.error("Failed to add product");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormDataState({ ...formDataState, image: e.target.files[0] });
    }
  };

  if (!isClient) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Products</h1>
        {userRole === "2" && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <table className="w-full bg-white">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-black">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black">Product Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black">Product Image</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : !productsData?.data?.productList?.length ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              productsData.data.productList.map((product: any) => (
                <tr key={product._id} className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{product.product_name}</td>
                  <td className="px-6 py-4 text-sm max-w-md text-black">
                    <div className="line-clamp-2">{product.product_description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">${product.product_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-10 w-10">
                      <Image
                        src={product.image_link || "https://via.placeholder.com/50"}
                        alt={product.product_name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 text-black border border-gray-300 hover:bg-gray-50"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-black border border-gray-300 hover:bg-gray-50"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="product_name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                placeholder="Enter product name"
                value={formDataState.product_name}
                onChange={(e) => setFormDataState({ ...formDataState, product_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Product Description
              </label>
              <textarea
                name="product_description"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                placeholder="Enter product description"
                rows={3}
                value={formDataState.product_description}
                onChange={(e) => setFormDataState({ ...formDataState, product_description: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Product Price
              </label>
              <input
                type="number"
                name="product_price"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                placeholder="Enter price"
                value={formDataState.product_price}
                onChange={(e) => setFormDataState({ ...formDataState, product_price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Product Image
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  id="product-image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="product-image"
                  className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-50"
                >
                  Choose File
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  {formDataState.image ? formDataState.image.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-black"
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-black hover:bg-gray-800 text-white"
              disabled={isAdding}
            >
              {isAdding ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 