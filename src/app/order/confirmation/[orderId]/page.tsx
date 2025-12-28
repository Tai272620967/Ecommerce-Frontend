import OrderConfirmation from "./components/OrderConfirmation";

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  return <OrderConfirmation orderId={params.orderId} />;
}

