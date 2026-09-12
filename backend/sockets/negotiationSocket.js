const Negotiation = require("../models/Negotiation");

const setupNegotiationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("joinNegotiation", async (negotiationId) => {
            try {
                if (!negotiationId || !socket.userId) return;

                const negotiation = await Negotiation.findById(negotiationId);

                if (!negotiation) return;

                const isParticipant =
                    negotiation.generator.toString() === socket.userId ||
                    negotiation.facility.toString() === socket.userId;

                if (!isParticipant) {
                    console.log("Unauthorized negotiation access");
                    return;
                }

                socket.join(`negotiation:${negotiationId}`);
            } catch (error) {
                console.error("Socket join error:", error.message);
            }
        });

        socket.on("leaveNegotiation", (negotiationId) => {
            if (!negotiationId) return;

            socket.leave(`negotiation:${negotiationId}`);
        });

        socket.on("newOffer", (data) => {
            if (!data?.negotiationId) return;

            io.to(`negotiation:${data.negotiationId}`).emit(
                "offerReceived",
                data
            );
        });

        socket.on("offerAccepted", (data) => {
            if (!data?.negotiationId) return;

            io.to(`negotiation:${data.negotiationId}`).emit(
                "negotiationAccepted",
                data
            );
        });

        socket.on("offerRejected", (data) => {
            if (!data?.negotiationId) return;

            io.to(`negotiation:${data.negotiationId}`).emit(
                "negotiationRejected",
                data
            );
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = setupNegotiationSocket;