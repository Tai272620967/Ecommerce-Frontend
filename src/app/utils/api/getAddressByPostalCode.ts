/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from "@/base/types/address";
import postal_code from 'japan-postal-code';
import { message } from "antd";

export const getAddressByPostalCode = async (postalCode: string): Promise<Address | null> => {
  try {
    return new Promise((resolve) => {
      postal_code.get(postalCode, (address: Address) => {
        if (address) {
          resolve({
            prefecture: address.prefecture,
            city: address.city,
            area: address.area,
            street: address.street,
          });
        } else {
          message.error("住所が見つかりませんでした")
          resolve(null); // Return null if address is not found
        }
      });
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};
