# Client Management System

A comprehensive full-stack client management application built with .NET Core, SQL Server, and React. Features role-based access control, real-time updates, and extensive client information management.

## Features

### Core Functionality
- **Authentication & Authorization** - JWT-based authentication with role-based access (Admin, Delivery, DevOps)
- **Client Management** - Complete client lifecycle management with search and filtering
- **VPN & Connections** - Manage VPN configurations and database/API connections
- **Server Infrastructure** - Track servers, metrics, and software installations
- **Contact Management** - Maintain client contact information
- **License Management** - Track software licenses with expiry notifications
- **Statistics & Analytics** - Usage, performance, and financial metrics
- **Support Tickets** - Full ticket management with comments and attachments
- **Updates & Releases** - Schedule and track software updates with deployment steps

### User Experience
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Keyboard Shortcuts** - Fast navigation with keyboard commands (Press `?` for help)
- **Accessibility** - WCAG AA compliant with screen reader support
- **Onboarding Tour** - Interactive guide for new users
- **Loading States** - Skeleton screens for better perceived performance
- **Empty States** - Helpful guidance when no data exists
- **Real-time Toasts** - Instant feedback for user actions
- **Pin Sections** - Customize section order and pin favorites

### Technical Features
- **Error Boundaries** - Graceful error handling with recovery options
- **Local Storage** - Persist user preferences and section order
- **Performance Optimized** - Debouncing, throttling, and lazy loading
- **Pagination** - Efficient handling of large datasets
- **Form Validation** - Comprehensive client and server-side validation
- **Dark Mode Ready** - Infrastructure for dark mode support
- **Iframe Embedding** - Fully configured for embedding in internal applications (see [IFRAME_QUICK_START.md](IFRAME_QUICK_START.md))

## Tech Stack

### Backend
- **.NET Core 8.0** - Modern web API framework
- **SQL Server** - Enterprise database with stored procedures
- **Dapper** - High-performance object mapper
- **JWT Authentication** - Secure token-based authentication

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **date-fns** - Date manipulation and formatting
- **Sonner** - Beautiful toast notifications

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- .NET Core 8.0 SDK
- SQL Server 2019+
- Visual Studio 2022 or VS Code

### Backend Setup

1. **Create Database**
```bash
# Run in SQL Server Management Studio or Azure Data Studio
# Execute the database scripts in order:
./backend/Phase1-Database.sql
./backend/Phase2-Database.sql
./backend/Phase3-Database.sql
./backend/Phase4-Database.sql
./backend/Phase5-Database.sql
./backend/Phase6-Database.sql
./backend/Phase7-Database.sql
./backend/Phase8-Database.sql
```

2. **Configure Connection String**
```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-characters",
    "Issuer": "ClientManagementAPI",
    "Audience": "ClientManagementApp",
    "ExpirationMinutes": 480
  }
}
```

3. **Install Backend Dependencies**
```bash
# In your .NET project directory
dotnet restore
```

4. **Copy Backend Code**
- Copy all DTOs from `./backend/Phase*-Backend.cs` to `Models/DTOs/`
- Copy all Repositories to `Repositories/`
- Copy all Controllers to `Controllers/`
- Update `Program.cs` with service registrations

5. **Run Backend**
```bash
dotnet run
# API will start on http://localhost:5000
```

### Frontend Setup

1. **Install Dependencies**
```bash
npm install
# or
yarn install
```

2. **Configure API URL**
```typescript
// services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';
```

3. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

4. **Build for Production**
```bash
npm run build
# or
yarn build
```

### Default Users

After running the database scripts, you'll have these test users:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| delivery1 | delivery123 | delivery |
| devops1 | devops123 | devops |

## Project Structure

```
├── backend/                    # Backend SQL and C# code
│   ├── Phase1-Database.sql     # Authentication & clients
│   ├── Phase2-Database.sql     # Status & health
│   ├── Phase3-Database.sql     # VPN & connections
│   ├── Phase4-Database.sql     # Servers
│   ├── Phase5-Database.sql     # Contacts & licenses
│   ├── Phase6-Database.sql     # Statistics
│   ├── Phase7-Database.sql     # Tickets
│   ├── Phase8-Database.sql     # Updates
│   └── Phase*-Backend.cs       # C# DTOs, Repos, Controllers
├── components/                 # React components
│   ├── sections/               # Section components
│   ├── ui/                     # shadcn/ui components
│   ├── EmptyStates.tsx         # Empty state components
│   ├── ErrorBoundary.tsx       # Error handling
│   ├── LoadingSkeletons.tsx    # Loading states
│   ├── OnboardingTour.tsx      # User onboarding
│   └── Pagination.tsx          # Pagination component
├── hooks/                      # Custom React hooks
│   ├── useClients.ts
│   ├── useVPNConfigurations.ts
│   ├── useConnections.ts
│   ├── useServers.ts
│   ├── useContacts.ts
│   ├── useLicenses.ts
│   ├── useStatistics.ts
│   ├── useTickets.ts
│   ├── useUpdates.ts
│   ├── useKeyboardShortcuts.ts
│   └── useLocalStorage.ts
├── services/                   # API services
│   └── api.ts                  # API client and endpoints
├── utils/                      # Utility functions
│   ├── validation.ts           # Form validation
│   ├── accessibility.ts        # A11y utilities
│   └── performance.ts          # Performance utilities
├── styles/                     # CSS files
│   ├── globals.css
│   └── responsive.css
└── App.tsx                     # Main app component
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search |
| `?` | Show keyboard shortcuts help |
| `↑` | Select previous client |
| `↓` | Select next client |
| `Escape` | Close dialogs |

## Role-Based Access

### Admin
- Full access to all features
- Can manage users, clients, and all resources
- Can delete resources

### DevOps
- Access to all client information including servers
- Can manage updates, configurations, and infrastructure
- Cannot delete resources

### Delivery
- Access to client information (excluding servers section)
- Can view VPN, connections, contacts, licenses
- Read-only access to most resources

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create client (Admin)
- `PUT /api/clients/{id}` - Update client (Admin)
- `DELETE /api/clients/{id}` - Delete client (Admin)

### VPN Configurations
- `GET /api/vpn/client/{clientId}` - List VPN configs
- `POST /api/vpn` - Create VPN config
- `PUT /api/vpn/{id}` - Update VPN config
- `DELETE /api/vpn/{id}` - Delete VPN config

### Connections
- `GET /api/connections/client/{clientId}` - List connections
- `POST /api/connections` - Create connection
- `POST /api/connections/test` - Test connection
- `PUT /api/connections/{id}` - Update connection
- `DELETE /api/connections/{id}` - Delete connection

### Servers
- `GET /api/servers/client/{clientId}` - List servers
- `POST /api/servers` - Create server
- `POST /api/servers/metrics` - Record metrics
- `GET /api/servers/{id}/metrics` - Get server metrics

### Contacts
- `GET /api/contacts/client/{clientId}` - List contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/{id}` - Update contact

### Licenses
- `GET /api/licenses/client/{clientId}` - List licenses
- `POST /api/licenses` - Create license
- `PUT /api/licenses/{id}/renew` - Renew license
- `GET /api/licenses/expiring` - Get expiring licenses

### Statistics
- `POST /api/statistics` - Record statistic
- `GET /api/statistics/client/{clientId}` - Get statistics
- `POST /api/statistics/usage` - Record usage metrics
- `POST /api/statistics/performance` - Record performance
- `POST /api/statistics/financial` - Record financial data

### Tickets
- `GET /api/tickets` - List all tickets
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `GET /api/tickets/{id}/comments` - Get comments
- `POST /api/tickets/comments` - Add comment
- `GET /api/tickets/statistics` - Get ticket stats

### Updates
- `GET /api/updates` - List all updates
- `POST /api/updates` - Create update
- `PUT /api/updates/{id}` - Update update
- `GET /api/updates/{id}/steps` - Get deployment steps
- `POST /api/updates/steps` - Create step
- `GET /api/updates/upcoming` - Get upcoming updates

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

This application follows WCAG 2.1 Level AA guidelines:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus indicators
- Skip links for navigation

## Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+
- Lazy loading for images and components
- Debounced search inputs
- Pagination for large datasets
- Optimized bundle size with code splitting

## Security

- JWT token authentication
- Role-based authorization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection
- Secure password hashing (BCrypt)
- HTTPS enforced in production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@example.com or open an issue in the repository.

## Roadmap

- [ ] Email notifications for license expiry
- [ ] Real-time updates with SignalR
- [ ] Dark mode theme
- [ ] Export data to Excel/PDF
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Audit log viewer
- [ ] File attachments for all resources
- [ ] Integration with external ticketing systems

## Acknowledgments

- shadcn/ui for the component library
- Tailwind CSS for the styling system
- Lucide React for the icon set
- date-fns for date utilities