import React, { useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();

  // Filter states
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  // Filter options
  const roomTypes = ["Deluxe", "Suite", "Standard"];
  const priceRanges = ["50 to 100", "100 to 200", "200 to 500"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  // Filtering logic
  let filteredRooms = [...roomsDummyData];

  // Filter by room type
  if (selectedRoomTypes.length > 0) {
    filteredRooms = filteredRooms.filter((room) =>
      selectedRoomTypes.includes(room.roomType)
    );
  }

  // Filter by price range
  if (selectedPriceRange.length > 0) {
    filteredRooms = filteredRooms.filter((room) => {
      return selectedPriceRange.some((range) => {
        const [min, max] = range.split(" to ").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      });
    });
  }

  // Sorting
  if (selectedSort === "Price Low to High") {
    filteredRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (selectedSort === "Price High to Low") {
    filteredRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (selectedSort === "Newest First") {
    filteredRooms.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8">
      {/* Rooms List */}
      <div className="flex-1">
        <div className="flex flex-col items-start text-left mb-6">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <p className="text-gray-500 mt-10">No rooms match your filters.</p>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            >
              <img
                src={room.images[0]}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel.city}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel.name}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ Reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-Icon" />
                  <span>{room.hotel.address}</span>
                </div>

                {/* Room Amenities */}
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={facilityIcons[item]}
                        alt="item"
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Room Price per Night */}
                <p className="text-xl font-medium text-gray-700">
                  ${room.pricePerNight} /night
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white w-80 border border-gray-300 rounded-lg shadow-sm p-5 text-gray-700">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">FILTERS</p>
          <button
            onClick={() => {
              setSelectedRoomTypes([]);
              setSelectedPriceRange([]);
              setSelectedSort("");
            }}
            className="text-sm text-blue-500 hover:underline"
          >
            CLEAR
          </button>
        </div>

        {/* Room Types */}
        <div className="mb-4">
          <p className="font-medium">Room Type</p>
          {roomTypes.map((room, index) => (
            <CheckBox
              key={index}
              label={room}
              selected={selectedRoomTypes.includes(room)}
              onChange={(checked, label) => {
                if (checked) {
                  setSelectedRoomTypes([...selectedRoomTypes, label]);
                } else {
                  setSelectedRoomTypes(
                    selectedRoomTypes.filter((r) => r !== label)
                  );
                }
              }}
            />
          ))}
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <p className="font-medium">Price Range</p>
          {priceRanges.map((range, index) => (
            <CheckBox
              key={index}
              label={`$ ${range}`}
              selected={selectedPriceRange.includes(range)}
              onChange={(checked, label) => {
                const cleanLabel = label.replace("$ ", "");
                if (checked) {
                  setSelectedPriceRange([...selectedPriceRange, cleanLabel]);
                } else {
                  setSelectedPriceRange(
                    selectedPriceRange.filter((r) => r !== cleanLabel)
                  );
                }
              }}
            />
          ))}
        </div>

        {/* Sort Options */}
        <div className="mb-2">
          <p className="font-medium">Sort By</p>
          {sortOptions.map((option, index) => (
            <RadioButton
              key={index}
              label={option}
              selected={selectedSort === option}
              onChange={(label) => setSelectedSort(label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
