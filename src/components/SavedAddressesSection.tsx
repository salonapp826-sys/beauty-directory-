import { useState, FormEvent } from 'react';
import { SavedAddress } from '../types';

interface SavedAddressesSectionProps {
  addresses: SavedAddress[];
  onSaveAddress: (address: SavedAddress) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
}

type AddressTag = 'Flagship' | 'Branch' | 'Studio' | 'Warehouse' | 'Academy';

const TAG_CONFIG: Record<AddressTag, { label: string; bg: string; text: string; border: string; icon: string }> = {
  Flagship: {
    label: 'Flagship Outlet',
    bg: 'bg-[#FDE7F3]',
    text: 'text-[#8e004b]',
    border: 'border-[#8e004b]/30',
    icon: 'star',
  },
  Studio: {
    label: 'Beauty Studio',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: 'spa',
  },
  Branch: {
    label: 'Salon Branch',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'storefront',
  },
  Warehouse: {
    label: 'Stock Warehouse',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: 'inventory_2',
  },
  Academy: {
    label: 'Training Academy',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: 'school',
  },
};

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Telangana',
  'Tamil Nadu',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Punjab',
  'Uttar Pradesh',
  'Kerala',
  'Haryana',
  'Goa',
  'Madhya Pradesh',
  'Other',
];

export function SavedAddressesSection({
  addresses,
  onSaveAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: SavedAddressesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Form states
  const [branchName, setBranchName] = useState('');
  const [tag, setTag] = useState<AddressTag>('Branch');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [gstin, setGstin] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState('');

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 2800);
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setBranchName('');
    setTag('Branch');
    setRecipientName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setLandmark('');
    setCity('');
    setState('Maharashtra');
    setPincode('');
    setGstin('');
    setIsDefault(addresses.length === 0);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setBranchName(addr.branchName);
    setTag(addr.tag);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setGstin(addr.gstin || '');
    setIsDefault(addr.isDefault);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormError('');
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!branchName.trim()) {
      setFormError('Please enter the Salon Branch name.');
      return;
    }
    if (!recipientName.trim()) {
      setFormError('Please enter the recipient or manager name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setFormError('Please provide a valid 10-digit mobile/WhatsApp number.');
      return;
    }
    if (!addressLine1.trim()) {
      setFormError('Please specify the building, floor, or street details.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please provide the city.');
      return;
    }
    if (!pincode.trim() || pincode.replace(/\D/g, '').length !== 6) {
      setFormError('Please provide a valid 6-digit postal PIN code.');
      return;
    }

    const newAddress: SavedAddress = {
      id: editingAddress ? editingAddress.id : `addr-${Date.now()}`,
      branchName: branchName.trim(),
      tag,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state,
      pincode: pincode.trim(),
      gstin: gstin.trim() || undefined,
      isDefault: addresses.length === 0 ? true : isDefault,
    };

    onSaveAddress(newAddress);
    handleCloseModal();
    showNotification(
      editingAddress
        ? `Branch "${newAddress.branchName}" updated successfully.`
        : `New delivery branch "${newAddress.branchName}" added.`
    );
  };

  const handleCopyAddress = (addr: SavedAddress) => {
    const fullText = `${addr.branchName}
Attn: ${addr.recipientName} (Ph: ${addr.phone})
${addr.addressLine1}
${addr.addressLine2 ? `${addr.addressLine2}\n` : ''}${addr.landmark ? `Landmark: ${addr.landmark}\n` : ''}${addr.city}, ${addr.state} - ${addr.pincode}${addr.gstin ? `\nGSTIN: ${addr.gstin}` : ''}`;

    navigator.clipboard.writeText(fullText).catch(() => {});
    setCopiedId(addr.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    showNotification(`Address for "${addr.branchName}" copied to clipboard.`);
  };

  const filteredAddresses = addresses.filter((addr) => {
    const matchesSearch =
      addr.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.pincode.includes(searchQuery);

    const matchesTag = tagFilter === 'all' || addr.tag === tagFilter;

    return matchesSearch && matchesTag;
  });

  return (
    <div id="saved-addresses-section" className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-xs">
      {/* Toast Banner */}
      {feedbackMessage && (
        <div className="mb-4 bg-[#8e004b] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#E8E8E8]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1c1b1b]">Saved Salon Delivery Locations</h2>
            <span className="text-xs font-semibold bg-[#FDE7F3] text-[#8e004b] px-2.5 py-0.5 rounded-full border border-[#8e004b]/20">
              {addresses.length} Branches
            </span>
          </div>
          <p className="text-xs text-[#594047] mt-0.5">
            Store and manage delivery addresses across your branch network for quick wholesale dispatch & GST invoices.
          </p>
        </div>

        <button
          id="add-address-btn"
          onClick={handleOpenAddModal}
          className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-xs active:scale-95 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-base">add_location_alt</span>
          <span>Add New Branch Location</span>
        </button>
      </div>

      {/* Filter / Search Bar if multiple addresses exist */}
      {addresses.length > 1 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-4 pb-2">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#594047] text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search branch, city, or PIN code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-[#594047] mr-1">Filter:</span>
            {['all', 'Flagship', 'Studio', 'Branch', 'Warehouse'].map((t) => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors capitalize ${
                  tagFilter === t
                    ? 'bg-[#8e004b] text-white font-bold'
                    : 'bg-[#F0EDEC] text-[#594047] hover:bg-[#ece7e7]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-[#E8E8E8] rounded-2xl mt-4">
          <div className="w-14 h-14 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">location_off</span>
          </div>
          <h3 className="font-bold text-sm text-[#1c1b1b]">No Delivery Locations Added Yet</h3>
          <p className="text-xs text-[#594047] max-w-sm mx-auto mt-1 mb-4">
            Add your flagship salon, spa studios, or academy locations to ensure wholesale shipments arrive at the correct branch.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold py-2 px-4 rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add First Salon Branch</span>
          </button>
        </div>
      ) : filteredAddresses.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#594047]">
          No salon branches match your filter query "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredAddresses.map((addr) => {
            const tagInfo = TAG_CONFIG[addr.tag] || TAG_CONFIG.Branch;
            const isDeleting = deleteConfirmId === addr.id;
            const isCopied = copiedId === addr.id;

            return (
              <div
                id={`address-card-${addr.id}`}
                key={addr.id}
                className={`relative rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  addr.isDefault
                    ? 'bg-[#FFF9FC] border-[#8e004b]/40 shadow-xs ring-1 ring-[#8e004b]/20'
                    : 'bg-[#FAF8F8] border-[#E8E8E8] hover:border-[#8e004b]/30 shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Row: Tag & Default Indicator */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tagInfo.bg} ${tagInfo.text} ${tagInfo.border}`}
                      >
                        <span className="material-symbols-outlined text-xs">{tagInfo.icon}</span>
                        <span>{tagInfo.label}</span>
                      </span>

                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#8e004b] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>DEFAULT DISPATCH</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyAddress(addr)}
                      title="Copy full delivery address"
                      className="text-[#594047] hover:text-[#8e004b] p-1 rounded-md hover:bg-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>

                  {/* Branch Name */}
                  <h3 className="font-bold text-sm text-[#1c1b1b] flex items-center gap-1.5">
                    <span>{addr.branchName}</span>
                  </h3>

                  {/* Recipient & Contact */}
                  <div className="mt-2 text-xs text-[#594047] space-y-1">
                    <p className="flex items-center gap-1.5 font-medium text-[#1c1b1b]">
                      <span className="material-symbols-outlined text-xs text-[#8e004b]">person</span>
                      <span>{addr.recipientName}</span>
                      <span className="text-[#8c7077] font-normal">• {addr.phone}</span>
                    </p>

                    {/* Address Lines */}
                    <p className="flex items-start gap-1.5 pt-1 text-xs text-[#443a3d]">
                      <span className="material-symbols-outlined text-xs text-[#594047] mt-0.5 flex-shrink-0">
                        location_on
                      </span>
                      <span>
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        {addr.landmark ? ` (Landmark: ${addr.landmark})` : ''}
                        <br />
                        <strong className="text-[#1c1b1b]">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </strong>
                      </span>
                    </p>

                    {/* GSTIN badge if present */}
                    {addr.gstin && (
                      <p className="text-[11px] text-[#0150d6] font-mono font-medium pt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">receipt</span>
                        <span>Branch GST: {addr.gstin}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        id={`set-default-btn-${addr.id}`}
                        onClick={() => {
                          onSetDefaultAddress(addr.id);
                          showNotification(`"${addr.branchName}" is now your default delivery branch.`);
                        }}
                        className="text-xs font-semibold text-[#8e004b] hover:bg-[#FDE7F3] px-2.5 py-1.5 rounded-lg border border-[#8e004b]/30 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span>Set as Default</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      id={`edit-address-btn-${addr.id}`}
                      onClick={() => handleOpenEditModal(addr)}
                      className="bg-white hover:bg-[#F0EDEC] text-[#1c1b1b] text-xs font-semibold py-1.5 px-3 rounded-lg border border-[#E8E8E8] flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Edit</span>
                    </button>

                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                        <span className="text-[10px] text-red-700 font-bold px-1">Confirm?</span>
                        <button
                          onClick={() => {
                            onDeleteAddress(addr.id);
                            setDeleteConfirmId(null);
                            showNotification(`Branch "${addr.branchName}" removed.`);
                          }}
                          className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-1 rounded"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[#594047] text-[10px] font-medium px-1.5 py-1 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`delete-address-btn-${addr.id}`}
                        onClick={() => setDeleteConfirmId(addr.id)}
                        disabled={addr.isDefault && addresses.length > 1}
                        title={
                          addr.isDefault && addresses.length > 1
                            ? 'Make another address default before deleting this'
                            : 'Delete location'
                        }
                        className={`text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1 ${
                          addr.isDefault && addresses.length > 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-[#8c7077] hover:text-[#ba1a1a] hover:bg-red-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal Dialog */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E8E8E8] my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#FCF9F8] p-5 border-b border-[#E8E8E8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">
                    {editingAddress ? 'edit_location' : 'add_location_alt'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1c1b1b]">
                    {editingAddress ? 'Edit Salon Branch Location' : 'Add New Salon Branch Location'}
                  </h3>
                  <p className="text-xs text-[#594047]">
                    Ensure accurate pin codes for express pan-India wholesale freight.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 text-[#594047] hover:text-[#1c1b1b] hover:bg-[#F0EDEC] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-5 md:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-[#ba1a1a] text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Branch Name & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    Branch / Location Name <span className="text-[#8e004b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aura Luxe Flagship or Bandra Studio"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">Branch Type</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as AddressTag)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  >
                    <option value="Flagship">Flagship Outlet</option>
                    <option value="Studio">Beauty Studio</option>
                    <option value="Branch">Salon Branch</option>
                    <option value="Warehouse">Stock Warehouse</option>
                    <option value="Academy">Training Academy</option>
                  </select>
                </div>
              </div>

              {/* Recipient & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    Contact Person / Store Manager <span className="text-[#8e004b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pooja Verma (Branch Lead)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    Mobile / WhatsApp for Delivery <span className="text-[#8e004b]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                  Address Line 1 (Shop/Flat No., Building Name, Street) <span className="text-[#8e004b]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop 4 & 5, Ground Floor, Linking Road, Plot 14"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>

              {/* Address Line 2 & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    Address Line 2 (Area / Locality)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra West / Near National College"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    Prominent Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Starbucks / Behind Metro Stn"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>
              </div>

              {/* City, State & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    City <span className="text-[#8e004b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                    6-Digit PIN Code <span className="text-[#8e004b]">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 400050"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                </div>
              </div>

              {/* Branch GSTIN (Optional) */}
              <div>
                <label className="text-xs font-bold text-[#1c1b1b] block mb-1">
                  Branch-Specific GSTIN (Optional, for localized GSTR-2B filing)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 27AABCU9603R1ZM"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-mono text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>

              {/* Default Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8e004b] focus:ring-[#8e004b] border-[#E8E8E8]"
                  />
                  <span className="text-xs font-semibold text-[#1c1b1b]">
                    Set as default delivery branch for all one-click wholesale replenishments
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E8E8E8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-[#594047] hover:bg-[#F0EDEC] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>{editingAddress ? 'Save Location Changes' : 'Add Branch Location'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
