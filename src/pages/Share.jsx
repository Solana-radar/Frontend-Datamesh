import React, { useState } from "react";
import { Camera, X, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";

function Share() {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      item: "",
      price: "",
      quantity: "",
      hsnNumber: "",
      amount: "",
      date: "",
      time: "",
    },
    validationSchema: Yup.object({
      item: Yup.string().required("Item is required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
      quantity: Yup.number()
        .required("Quantity is required")
        .positive("Quantity must be positive"),
      hsnNumber: Yup.string().required("HSN Number is required"),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
      date: Yup.date()
        .required("Date is required")
        .max(new Date(), "Date cannot be in the future"),
      time: Yup.string().required("Time is required"),
    }),
    onSubmit: async (values) => {
      setIsUploading(true);
      try {
        console.log("Form submitted:", values);
        setPreview(null);
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6"
      >
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center">
          Share to Earn
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Enter the details below to upload your information.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          {/* Inputs for Item, Price, and Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Item"
                {...formik.getFieldProps("item")}
                className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.item && formik.errors.item && (
                <p className="text-sm text-red-500">{formik.errors.item}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Price"
                {...formik.getFieldProps("price")}
                className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-sm text-red-500">{formik.errors.price}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Quantity"
                {...formik.getFieldProps("quantity")}
                className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <p className="text-sm text-red-500">{formik.errors.quantity}</p>
              )}
            </div>
          </div>

          {/* HSN Number and Amount */}
          <div>
            <input
              type="text"
              placeholder="HSN Number"
              {...formik.getFieldProps("hsnNumber")}
              className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            {formik.touched.hsnNumber && formik.errors.hsnNumber && (
              <p className="text-sm text-red-500">{formik.errors.hsnNumber}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Amount"
              {...formik.getFieldProps("amount")}
              className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-sm text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                {...formik.getFieldProps("date")}
                className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-sm text-red-500">{formik.errors.date}</p>
              )}
            </div>
            <div>
              <input
                type="time"
                {...formik.getFieldProps("time")}
                className="w-full p-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.time && formik.errors.time && (
                <p className="text-sm text-red-500">{formik.errors.time}</p>
              )}
            </div>
          </div>

          {/* Photo Button */}
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="w-full flex items-center justify-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            <Camera className="h-5 w-5 mr-2" />
            Add Photo
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? (
              <>
                <Loader className="animate-spin h-5 w-5 inline-block mr-2" />
                Uploading...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Share;
