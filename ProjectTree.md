CarbonChain
│
├─ BACKEND
│  │
│  ├─ Configuration
│  │  └─ mongoose_configuration.js
│  │     - Establishes and manages the MongoDB database connection.
│  │
│  ├─ Controllers
│  │  ├─ authController.js
│  │  │  - Handles user registration, login and authentication logic.
│  │  ├─ userController.js
│  │  │  - Handles user profiles and logistics-provider retrieval.
│  │  ├─ verificationController.js
│  │  │  - Handles Aadhaar/GST verification workflows.
│  │  ├─ wasteController.js
│  │  │  - Handles waste registration, retrieval, updates and cancellation.
│  │  ├─ facilityController.js
│  │  │  - Handles facility registration, management and discovery.
│  │  ├─ matchingController.js
│  │  │  - Finds and manages suitable facilities for registered waste.
│  │  ├─ negotiationController.js
│  │  │  - Handles offers, counter-offers and negotiation acceptance.
│  │  ├─ shipmentController.js
│  │  │  - Handles shipment creation, logistics assignment and status updates.
│  │  ├─ paymentController.js
│  │  │  - Handles payment creation, verification and transaction status.
│  │  ├─ carbonController.js
│  │  │  - Calculates and manages carbon-impact records.
│  │  └─ trackingController.js
│  │     - Manages Digital Waste Passports and lifecycle tracking.
│  │
│  ├─ Middleware
│  │  ├─ authMiddleware.js
│  │  │  - Verifies JWT tokens and attaches authenticated user information.
│  │  └─ roleMiddleware.js
│  │     - Restricts API operations according to user roles.
│  │
│  ├─ Models
│  │  ├─ User.js
│  │  │  - Stores users, roles, organizations and verification status.
│  │  ├─ WasteBatch.js
│  │  │  - Stores registered waste batches and their lifecycle status.
│  │  ├─ Facility.js
│  │  │  - Stores waste-processing facilities and their capabilities.
│  │  ├─ WasteMatch.js
│  │  │  - Stores facility recommendations and match scores.
│  │  ├─ Negotiation.js
│  │  │  - Stores negotiations, offers and agreed prices.
│  │  ├─ Shipment.js
│  │  │  - Stores logistics, route, vehicle and shipment information.
│  │  ├─ Payment.js
│  │  │  - Stores payment transactions and payment status.
│  │  ├─ CarbonRecord.js
│  │  │  - Stores carbon factors and CO₂e avoided calculations.
│  │  └─ WastePassport.js
│  │     - Stores the complete digital identity and lifecycle of waste.
│  │
│  ├─ Routes
│  │  ├─ authRoutes.js
│  │  │  - Authentication and account routes.
│  │  ├─ userRoutes.js
│  │  │  - User and logistics-provider routes.
│  │  ├─ verificationRoutes.js
│  │  │  - Aadhaar and GST verification routes.
│  │  ├─ wasteRoutes.js
│  │  │  - Waste management API routes.
│  │  ├─ facilityRoutes.js
│  │  │  - Facility management and discovery routes.
│  │  ├─ matchingRoutes.js
│  │  │  - Waste-to-facility matching routes.
│  │  ├─ negotiationRoutes.js
│  │  │  - Negotiation and offer-management routes.
│  │  ├─ shipmentRoutes.js
│  │  │  - Shipment and logistics-management routes.
│  │  ├─ paymentRoutes.js
│  │  │  - Payment and transaction routes.
│  │  ├─ carbonRoutes.js
│  │  │  - Carbon-impact and carbon-summary routes.
│  │  └─ trackingRoutes.js
│  │     - Digital Waste Passport and tracking routes.
│  │
│  ├─ Sockets
│  │  └─ negotiationSocket.js
│  │     - Provides real-time communication for negotiations and offers.
│  │
│  ├─ Utils
│  │  ├─ carbonCalculator.js
│  │  │  - Calculates CO₂e avoided based on waste and processing method.
│  │  ├─ matchingEngine.js
│  │  │  - Calculates facility compatibility, distance, capacity and match score.
│  │  ├─ routeOptimizer.js
│  │  │  - Calculates transportation distance and estimated travel time.
│  │  ├─ paymentUtils.js
│  │  │  - Provides payment signatures and currency conversion utilities.
│  │  └─ trackingUtils.js
│  │     - Generates passport IDs and manages waste lifecycle statuses.
│  │
│  └─ app.js
│     - Initializes Express, middleware, API routes and Socket.IO.
│
│
└─ FRONTEND
   │
   ├─ Components
   │  │
   │  ├─ Auth
   │  │  ├─ LoginForm.jsx
   │  │  │  - Provides the user login interface.
   │  │  ├─ RegisterForm.jsx
   │  │  │  - Provides user registration functionality.
   │  │  ├─ AadhaarVerification.jsx
   │  │  │  - Provides Aadhaar verification interface.
   │  │  └─ GSTVerification.jsx
   │  │     - Provides GST verification interface.
   │  │
   │  ├─ Waste
   │  │  ├─ WasteForm.jsx
   │  │  │  - Form for registering waste batches.
   │  │  ├─ WasteCard.jsx
   │  │  │  - Displays waste batch information.
   │  │  ├─ WasteList.jsx
   │  │  │  - Displays registered waste batches.
   │  │  ├─ WasteDetails.jsx
   │  │  │  - Displays detailed waste information.
   │  │  └─ WasteStatus.jsx
   │  │     - Displays the current waste lifecycle status.
   │  │
   │  ├─ Facility
   │  │  ├─ FacilityForm.jsx
   │  │  │  - Form for registering processing facilities.
   │  │  ├─ FacilityCard.jsx
   │  │  │  - Displays facility information.
   │  │  ├─ FacilityList.jsx
   │  │  │  - Displays available facilities.
   │  │  ├─ FacilityDetails.jsx
   │  │  │  - Displays detailed facility information.
   │  │  └─ FacilityStatus.jsx
   │  │     - Displays facility operational status.
   │  │
   │  ├─ Matching
   │  │  ├─ MatchCard.jsx
   │  │  │  - Displays a recommended facility match.
   │  │  ├─ MatchList.jsx
   │  │  │  - Displays all facility matches for waste.
   │  │  ├─ MatchScore.jsx
   │  │  │  - Displays the calculated facility match score.
   │  │  └─ MatchActions.jsx
   │  │     - Handles accepting or rejecting facility matches.
   │  │
   │  ├─ Negotiation
   │  │  ├─ NegotiationCard.jsx
   │  │  │  - Displays negotiation information.
   │  │  ├─ NegotiationList.jsx
   │  │  │  - Displays active and completed negotiations.
   │  │  ├─ OfferForm.jsx
   │  │  │  - Allows users to submit offers and counter-offers.
   │  │  ├─ OfferHistory.jsx
   │  │  │  - Displays the history of negotiation offers.
   │  │  └─ NegotiationStatus.jsx
   │  │     - Displays the current negotiation state.
   │  │
   │  ├─ Shipment
   │  │  ├─ ShipmentCard.jsx
   │  │  │  - Displays shipment summary and logistics information.
   │  │  ├─ ShipmentList.jsx
   │  │  │  - Displays shipments for the current stakeholder.
   │  │  ├─ ShipmentDetails.jsx
   │  │  │  - Displays complete shipment information.
   │  │  ├─ ShipmentStatus.jsx
   │  │  │  - Displays shipment lifecycle progress.
   │  │  └─ AssignLogisticsForm.jsx
   │  │     - Assigns a logistics provider to a shipment.
   │  │
   │  ├─ Payment
   │  │  ├─ PaymentButton.jsx
   │  │  │  - Initiates and verifies a payment.
   │  │  ├─ PaymentCard.jsx
   │  │  │  - Displays payment transaction information.
   │  │  └─ PaymentList.jsx
   │  │     - Displays payment history and status.
   │  │
   │  ├─ Carbon
   │  │  ├─ CarbonImpactForm.jsx
   │  │  │  - Records waste-processing information for carbon calculation.
   │  │  ├─ CarbonCard.jsx
   │  │  │  - Displays an individual carbon-impact record.
   │  │  ├─ CarbonList.jsx
   │  │  │  - Displays carbon-impact records.
   │  │  └─ CarbonSummary.jsx
   │  │     - Displays total waste processed and CO₂e avoided.
   │  │
   │  ├─ Tracking
   │  │  ├─ WastePassport.jsx
   │  │  │  - Displays the Digital Waste Passport and lifecycle history.
   │  │  ├─ ShipmentTimeline.jsx
   │  │  │  - Displays shipment and waste lifecycle progress.
   │  │  └─ TrackingMap.jsx
   │  │     - Displays waste origin, destination and transportation route.
   │  │
   │  └─ Common
   │     ├─ Button.jsx
   │     │  - Reusable application button component.
   │     ├─ Input.jsx
   │     │  - Reusable form input component.
   │     ├─ Select.jsx
   │     │  - Reusable selection component.
   │     └─ Loader.jsx
   │        - Reusable loading indicator.
   │
   ├─ Pages
   │  │
   │  ├─ Auth
   │  │  ├─ Login.jsx
   │  │  │  - Login page for all platform users.
   │  │  ├─ Register.jsx
   │  │  │  - Registration page for new users.
   │  │  └─ Verification.jsx
   │  │     - User verification page.
   │  │
   │  ├─ Generator
   │  │  ├─ GeneratorDashboard.jsx
   │  │  │  - Main dashboard for waste generators.
   │  │  ├─ RegisterWaste.jsx
   │  │  │  - Registers a new waste batch.
   │  │  ├─ MyWaste.jsx
   │  │  │  - Displays the generator's registered waste.
   │  │  ├─ WasteDetailsPage.jsx
   │  │  │  - Displays detailed waste information.
   │  │  ├─ WasteMatches.jsx
   │  │  │  - Displays suitable facility matches.
   │  │  ├─ Negotiations.jsx
   │  │  │  - Displays generator negotiations.
   │  │  ├─ Shipments.jsx
   │  │  │  - Displays generator shipments.
   │  │  ├─ Payments.jsx
   │  │  │  - Displays generator payments.
   │  │  └─ CarbonTracking.jsx
   │  │     - Displays generator carbon impact.
   │  │
   │  ├─ Facility
   │  │  ├─ FacilityDashboard.jsx
   │  │  │  - Main dashboard for processing facilities.
   │  │  ├─ RegisterFacility.jsx
   │  │  │  - Registers a processing facility.
   │  │  ├─ MyFacilities.jsx
   │  │  │  - Displays facilities owned by the user.
   │  │  ├─ FacilityDetailsPage.jsx
   │  │  │  - Displays facility information.
   │  │  ├─ Negotiations.jsx
   │  │  │  - Displays facility negotiations.
   │  │  ├─ Shipments.jsx
   │  │  │  - Displays incoming and received shipments.
   │  │  ├─ Payments.jsx
   │  │  │  - Displays facility transactions.
   │  │  └─ CarbonTracking.jsx
   │  │     - Displays facility carbon-processing data.
   │  │
   │  ├─ Logistics
   │  │  ├─ LogisticsDashboard.jsx
   │  │  │  - Main dashboard for logistics providers.
   │  │  └─ Shipments.jsx
   │  │     - Displays shipments assigned to the logistics provider.
   │  │
   │  ├─ NegotiationDetails.jsx
   │  │  - Displays complete negotiation and offer details.
   │  │
   │  ├─ ShipmentDetailsPage.jsx
   │  │  - Displays shipment details and logistics status controls.
   │  │
   │  ├─ AssignLogistics.jsx
   │  │  - Allows generators or facilities to assign logistics providers.
   │  │
   │  ├─ Tracking.jsx
   │  │  - Displays the complete shipment tracking and waste passport view.
   │  │
   │  └─ Home.jsx
   │     - Landing page introducing the CarbonChain platform.
   │
   ├─ Context
   │  └─ AuthContext.jsx
   │     - Maintains authentication state across the application.
   │
   ├─ Hooks
   │  └─ useAuth.js
   │     - Provides convenient access to authentication state and actions.
   │
   ├─ Services
   │  ├─ api.js
   │  │  - Configures the Axios API client and backend communication.
   │  ├─ authService.js
   │  │  - Handles authentication API requests.
   │  ├─ userService.js
   │  │  - Handles user-related API requests.
   │  ├─ wasteService.js
   │  │  - Handles waste-management API requests.
   │  ├─ facilityService.js
   │  │  - Handles facility API requests.
   │  ├─ negotiationService.js
   │  │  - Handles negotiation API requests.
   │  ├─ shipmentService.js
   │  │  - Handles shipment and logistics API requests.
   │  ├─ paymentService.js
   │  │  - Handles payment API requests.
   │  ├─ carbonService.js
   │  │  - Handles carbon tracking API requests.
   │  ├─ trackingService.js
   │  │  - Handles Digital Waste Passport and tracking API requests.
   │  ├─ verificationService.js
   │  │  - Handles verification API requests.
   │  └─ socket.js
   │     - Manages real-time Socket.IO communication.
   │
   ├─ Routes
   │  ├─ AppRoutes.jsx
   │  │  - Defines application pages and navigation routes.
   │  └─ ProtectedRoute.jsx
   │     - Restricts pages based on authentication and user roles.
   │
   ├─ Utils
   │  └─ storage.js
   │     - Manages client-side authentication/token storage.
   │
   ├─ App.jsx
   │  - Root React application component.
   │
   └─ main.jsx
      - Frontend entry point that mounts the React application.