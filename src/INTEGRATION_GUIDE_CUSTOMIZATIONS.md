# 🔗 Customizations Module - Integration Guide

## Quick Integration Steps

### **STEP 1: Import the Component**

In your main client details page (likely `/App.tsx` or `/components/ClientDetails.tsx`):

```typescript
import { CustomizationSection } from './components/sections/CustomizationSection';
```

### **STEP 2: Add State for Pinning**

Add to your existing pinned sections state:

```typescript
const [pinnedSections, setPinnedSections] = useState({
  vpn: false,
  connection: false,
  servers: false,
  contacts: false,
  licenses: false,
  statistics: false,
  tickets: false,
  updates: false,
  customizations: false,  // NEW
});

const togglePin = (section: string) => {
  setPinnedSections(prev => ({
    ...prev,
    [section]: !prev[section]
  }));
};
```

### **STEP 3: Add to Section List**

Add the CustomizationSection to your sections array (where other sections are rendered):

```typescript
<CustomizationSection
  clientId={selectedClientId}
  isPinned={pinnedSections.customizations}
  onTogglePin={() => togglePin('customizations')}
/>
```

### **Complete Example:**

```typescript
export function ClientDetails({ clientId }: { clientId: number }) {
  const [pinnedSections, setPinnedSections] = useState({
    vpn: false,
    connection: false,
    servers: false,
    contacts: false,
    licenses: false,
    statistics: false,
    tickets: false,
    updates: false,
    customizations: false,  // NEW
  });

  const togglePin = (section: string) => {
    setPinnedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Existing sections */}
      <VPNSection 
        clientId={clientId} 
        isPinned={pinnedSections.vpn} 
        onTogglePin={() => togglePin('vpn')} 
      />
      
      <ConnectionSection 
        clientId={clientId} 
        isPinned={pinnedSections.connection} 
        onTogglePin={() => togglePin('connection')} 
      />
      
      <ServerSection 
        clientId={clientId} 
        isPinned={pinnedSections.servers} 
        onTogglePin={() => togglePin('servers')} 
      />
      
      <ContactSection 
        clientId={clientId} 
        isPinned={pinnedSections.contacts} 
        onTogglePin={() => togglePin('contacts')} 
      />
      
      <LicenseSection 
        clientId={clientId} 
        isPinned={pinnedSections.licenses} 
        onTogglePin={() => togglePin('licenses')} 
      />
      
      <StatisticsSection 
        clientId={clientId} 
        isPinned={pinnedSections.statistics} 
        onTogglePin={() => togglePin('statistics')} 
      />
      
      <TicketSection 
        clientId={clientId} 
        isPinned={pinnedSections.tickets} 
        onTogglePin={() => togglePin('tickets')} 
      />
      
      <UpdateSection 
        clientId={clientId} 
        isPinned={pinnedSections.updates} 
        onTogglePin={() => togglePin('updates')} 
      />
      
      {/* NEW: Customizations Section */}
      <CustomizationSection 
        clientId={clientId} 
        isPinned={pinnedSections.customizations} 
        onTogglePin={() => togglePin('customizations')} 
      />
    </div>
  );
}
```

---

## ✅ That's It!

The Customizations section will now appear in your client details page with:
- ✅ Full CRUD functionality
- ✅ Expandable customization cards
- ✅ Document management UI
- ✅ Pin/unpin capability
- ✅ Consistent styling with other sections

---

## 🧪 Test It

1. Navigate to any client
2. Scroll to the Customizations section
3. Click "Add Customization" to test create
4. Expand a customization to see documents
5. Try the upload/download buttons
6. Test delete functionality

---

## 📝 Next Steps (Optional)

If you want to actually implement file upload/download:

1. Add file upload endpoint to backend
2. Configure file storage (local/cloud)
3. Add file download endpoint
4. Connect upload button to file picker
5. Connect download button to download endpoint

See `/PHASE3_CUSTOMIZATIONS_COMPLETE.md` for detailed future enhancements!
