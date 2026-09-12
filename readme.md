
```
CarbonChain
├─ backend
│  ├─ .env
│  ├─ app.js
│  ├─ configuration
│  │  └─ mongoose_configuration.js
│  ├─ controllers
│  ├─ middleware
│  ├─ models
│  ├─ package.json
│  ├─ routes
│  ├─ sockets
│  └─ utils
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ vite.config.js
└─ README.md

```
```
CarbonChain
├─ backend
│  ├─ .env
│  ├─ app.js
│  ├─ configuration
│  │  └─ mongoose_configuration.js
│  ├─ controllers
│  │  ├─ authController.js
│  │  ├─ carbonController.js
│  │  ├─ facilityController.js
│  │  ├─ matchingController.js
│  │  ├─ negotiationController.js
│  │  ├─ shipmentController.js
│  │  ├─ userController.js
│  │  ├─ verificationController.js
│  │  └─ wasteController.js
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ roleMiddleware.js
│  ├─ models
│  │  ├─ CarbonRecord.js
│  │  ├─ Facility.js
│  │  ├─ Negotiation.js
│  │  ├─ Shipment.js
│  │  ├─ User.js
│  │  ├─ WasteBatch.js
│  │  └─ WasteMatch.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ authRoutes.js
│  │  ├─ carbonRoutes.js
│  │  ├─ facilityRoutes.js
│  │  ├─ matchingRoutes.js
│  │  ├─ negotiationRoutes.js
│  │  ├─ shipmentRoutes.js
│  │  ├─ userRoutes.js
│  │  ├─ verificationRoutes.js
│  │  └─ wasteRoutes.js
│  ├─ sockets
│  │  └─ negotiationSocket.js
│  └─ utils
│     ├─ carbonCalculator.js
│     ├─ matchingEngine.js
│     └─ routeOptimizer.js
├─ frontend
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ AadhaarVerification.jsx
│  │  │  │  ├─ GSTVerification.jsx
│  │  │  │  ├─ LoginForm.jsx
│  │  │  │  └─ RegisterForm.jsx
│  │  │  ├─ carbon
│  │  │  │  ├─ CarbonCard.jsx
│  │  │  │  ├─ CarbonImpactForm.jsx
│  │  │  │  ├─ CarbonList.jsx
│  │  │  │  └─ CarbonSummary.jsx
│  │  │  ├─ common
│  │  │  │  ├─ Button.jsx
│  │  │  │  ├─ Input.jsx
│  │  │  │  ├─ Loader.jsx
│  │  │  │  └─ Select.jsx
│  │  │  ├─ facility
│  │  │  │  ├─ CarbonTracking.jsx
│  │  │  │  ├─ FacilityCard.jsx
│  │  │  │  ├─ FacilityDetails.jsx
│  │  │  │  ├─ FacilityForm.jsx
│  │  │  │  ├─ FacilityList.jsx
│  │  │  │  └─ FacilityStatus.jsx
│  │  │  ├─ matching
│  │  │  │  ├─ MatchActions.jsx
│  │  │  │  ├─ MatchCard.jsx
│  │  │  │  ├─ MatchList.jsx
│  │  │  │  └─ MatchScore.jsx
│  │  │  ├─ negotiation
│  │  │  │  ├─ NegotiationCard.jsx
│  │  │  │  ├─ NegotiationList.jsx
│  │  │  │  ├─ NegotiationStatus.jsx
│  │  │  │  ├─ OfferForm.jsx
│  │  │  │  └─ OfferHistory.jsx
│  │  │  ├─ shipment
│  │  │  │  ├─ ShipmentCard.jsx
│  │  │  │  ├─ ShipmentDetails.jsx
│  │  │  │  ├─ ShipmentList.jsx
│  │  │  │  └─ ShipmentStatus.jsx
│  │  │  └─ waste
│  │  │     ├─ WasteCard.jsx
│  │  │     ├─ WasteDetails.jsx
│  │  │     ├─ WasteForm.jsx
│  │  │     ├─ WasteList.jsx
│  │  │     └─ WasteStatus.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
│  │  ├─ hooks
│  │  │  └─ useAuth.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ auth
│  │  │  │  ├─ Login.jsx
│  │  │  │  ├─ Register.jsx
│  │  │  │  └─ Verification.jsx
│  │  │  ├─ facility
│  │  │  │  ├─ CarbonTracking.jsx
│  │  │  │  ├─ FacilityDashboard.jsx
│  │  │  │  ├─ FacilityDetailsPage.jsx
│  │  │  │  ├─ MyFacilities.jsx
│  │  │  │  ├─ Negotiations.jsx
│  │  │  │  ├─ RegisterFacility.jsx
│  │  │  │  └─ Shipments.jsx
│  │  │  ├─ generator
│  │  │  │  ├─ CarbonTracking.jsx
│  │  │  │  ├─ GeneratorDashboard.jsx
│  │  │  │  ├─ MyWaste.jsx
│  │  │  │  ├─ Negotiations.jsx
│  │  │  │  ├─ RegisterWaste.jsx
│  │  │  │  ├─ Shipments.jsx
│  │  │  │  ├─ WasteDetailsPage.jsx
│  │  │  │  └─ WasteMatches.jsx
│  │  │  ├─ NegotiationDetails.jsx
│  │  │  └─ ShipmentDetailsPage.jsx
│  │  ├─ routes
│  │  │  ├─ AppRoutes.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ services
│  │  │  ├─ api.js
│  │  │  ├─ authService.js
│  │  │  ├─ carbonService.js
│  │  │  ├─ facilityService.js
│  │  │  ├─ negotiationService.js
│  │  │  ├─ shipmentService.js
│  │  │  ├─ socket.js
│  │  │  ├─ verificationService.js
│  │  │  └─ wasteService.js
│  │  └─ utils
│  │     └─ storage.js
│  └─ vite.config.js
└─ README.md

```