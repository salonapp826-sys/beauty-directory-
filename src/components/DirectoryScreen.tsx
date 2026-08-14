import { useState, useMemo } from 'react';
import { DISTRIBUTORS_DATA } from '../data/mockData';
import { Distributor } from '../types';

interface DirectoryScreenProps {
  onSelectDistributor: (distributor: Distributor) => void;
  onRequestQuote: (distributor: Distributor) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function DirectoryScreen({
  onSelectDistributor,
  onRequestQuote,
  searchQuery,
  setSearchQuery,
}: DirectoryScreenProps) {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const cities = ['All', 'Maharashtra', 'Delhi NCR', 'Karnataka', 'Telangana'];
  const categories = ['All', 'Skincare', 'Haircare', 'Makeup', 'Tools', 'Furniture', 'Spa Equipment'];

  const filteredDistributors = useMemo(() => {
    return DISTRIBUTORS_DATA.filter((dist) => {
      const matchCity = selectedCity === 'All' || dist.state === selectedCity;
      const matchCat =
        selectedCategory === 'All' || dist.categories.includes(selectedCategory);
      const matchSearch =
        !searchQuery ||
        dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dist.brands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dist.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchCat && matchSearch;
    });
  }, [selectedCity, selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDE7F3] text-[#8e004b] text-xs font-semibold rounded-full mb-2">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Verified GSTIN & Authorized Distribution Partners</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1c1b1b]">
          B2B Beauty Distributor Directory
        </h1>
        <p className="text-sm text-[#594047] mt-1">
          Connect directly with verified master distributors across India for wholesale rates, genuine batches, and credit terms.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#F0EDEC] p-4 rounded-xl border border-[#E8E8E8] mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
            search
          </span>
          <input
            id="directory-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search distributor or brand (e.g. Dyson, MAC, L'Oreal)..."
            className="w-full bg-white border border-[#E8E8E8] rounded-lg py-2 pl-9 pr-3 text-xs md:text-sm text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
          />
        </div>

        {/* State/City Filter */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-xs font-semibold text-[#594047] whitespace-nowrap">State:</span>
          {cities.map((city) => (
            <button
              id={`filter-city-${city.toLowerCase()}`}
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCity === city
                  ? 'bg-[#8e004b] text-white shadow-xs'
                  : 'bg-white text-[#594047] hover:bg-[#FDE7F3] hover:text-[#8e004b]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
        <span className="text-xs font-semibold text-[#594047] whitespace-nowrap">Category:</span>
        {categories.map((cat) => (
          <button
            id={`filter-category-${cat.toLowerCase()}`}
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/30 font-bold'
                : 'bg-[#F0EDEC] text-[#594047] hover:bg-[#ece7e7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Distributors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDistributors.map((dist) => (
          <div
            id={`distributor-card-${dist.id}`}
            key={dist.id}
            className="bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#8e004b]/60 transition-all hover:shadow-lg p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={dist.logo}
                    alt={dist.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E8E8E8]"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#1c1b1b] leading-tight">
                      {dist.name}
                    </h3>
                    <p className="text-xs text-[#594047] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs text-[#8e004b]">location_on</span>
                      <span>{dist.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-amber-500 text-xs">star</span>
                    <span>{dist.rating}</span>
                  </div>
                  <span className="text-[10px] text-[#594047] mt-0.5">{dist.reviewsCount} reviews</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#594047] line-clamp-2 mb-3">
                {dist.description}
              </p>

              {/* Badges / Specs */}
              <div className="grid grid-cols-2 gap-2 bg-[#F0EDEC] p-3 rounded-xl text-xs mb-4">
                <div>
                  <span className="text-[10px] text-[#594047] block">Min Order Value</span>
                  <span className="font-bold text-[#1c1b1b]">₹{dist.minOrderValue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#594047] block">Delivery SLA</span>
                  <span className="font-bold text-[#0150d6] truncate block">{dist.deliveryTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#594047] block">GST Number</span>
                  <span className="font-mono text-[11px] font-semibold text-[#1c1b1b]">{dist.gstNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#594047] block">Experience</span>
                  <span className="font-bold text-[#1c1b1b]">{dist.yearsInBusiness} Years Verified</span>
                </div>
              </div>

              {/* Brands Supplied */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#594047] block mb-1">
                  Brands Supplied:
                </span>
                <div className="flex flex-wrap gap-1">
                  {dist.brands.map((brand) => (
                    <span
                      key={brand}
                      className="bg-[#FDE7F3] text-[#8e004b] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#8e004b]/10"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#E8E8E8] flex items-center gap-2">
              <button
                id={`whatsapp-btn-${dist.id}`}
                onClick={() => {
                  window.open(
                    `https://wa.me/${dist.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                      dist.name
                    )},%20I%20am%20a%20salon%20owner%20reaching%20out%20via%20Nexora%20for%20wholesale%20rates.`,
                    '_blank'
                  );
                }}
                className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-xs py-2 px-3 rounded-lg border border-[#25D366]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>WhatsApp</span>
              </button>

              <button
                id={`quote-btn-${dist.id}`}
                onClick={() => onRequestQuote(dist)}
                className="flex-1 bg-[#8e004b] hover:bg-[#b90064] text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">request_quote</span>
                <span>Request Quote</span>
              </button>

              <button
                id={`catalog-btn-${dist.id}`}
                onClick={() => onSelectDistributor(dist)}
                className="p-2 bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] rounded-lg transition-colors"
                title="View Catalog Products"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
