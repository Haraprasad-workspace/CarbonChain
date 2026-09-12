import { useNavigate } from "react-router-dom";

const PaymentCard = ({ payment, showActions = false, onPay }) => {
    const navigate = useNavigate();

    const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-blue-100 text-blue-700",
        SUCCESS: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
        CANCELLED: "bg-gray-100 text-gray-700",
        REFUNDED: "bg-purple-100 text-purple-700"
    };

    const statusClass =
        statusStyles[payment?.status] ||
        "bg-gray-100 text-gray-700";

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Payment
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                        ₹{Number(payment?.amount || 0).toLocaleString("en-IN")}
                    </h3>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                >
                    {payment?.status || "UNKNOWN"}
                </span>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">

                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Waste Type
                    </span>

                    <span className="font-medium text-gray-900">
                        {payment?.wasteBatch?.wasteType || "N/A"}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Quantity
                    </span>

                    <span className="font-medium text-gray-900">
                        {payment?.wasteBatch?.quantity?.value || 0}{" "}
                        {payment?.wasteBatch?.quantity?.unit || ""}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Payment Method
                    </span>

                    <span className="font-medium text-gray-900">
                        {payment?.paymentMethod || "N/A"}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Created
                    </span>

                    <span className="font-medium text-gray-900">
                        {payment?.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString("en-IN")
                            : "N/A"}
                    </span>
                </div>

                {payment?.paidAt && (
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                            Paid On
                        </span>

                        <span className="font-medium text-gray-900">
                            {new Date(payment.paidAt).toLocaleDateString("en-IN")}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            {showActions && payment?.status === "PENDING" && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            if (onPay) {
                                onPay(payment);
                            } else {
                                navigate(`/payments/${payment._id}`);
                            }
                        }}
                        className="w-full rounded-xl bg-black text-white py-3 font-semibold hover:bg-gray-800 transition"
                    >
                        Pay ₹{Number(payment?.amount || 0).toLocaleString("en-IN")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentCard;