import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PaymentTrackingModule", (m) => {
  const paymentTracking = m.contract("PaymentTracking", []);

  return { paymentTracking };
});
