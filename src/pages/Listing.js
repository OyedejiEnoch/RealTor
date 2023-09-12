import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const position = {
    lat: 51.509865,
    long: -0.118092,
  };
  SwiperCore.use(Autoplay, Navigation, Pagination);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  //   if (loading) {
  //     <Spinner />;
  //   }

  const handleClick = (e) => {
    e.preventDefault();
    setShowContact(!showContact);
  };

  return (
    <main>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            modules={[EffectFade]}
            autoplay={{ delay: 3000 }}
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full overflow-hidden h-[300px]"
                  style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full 
          w-12 h-12 flex justify-center items-center"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShareLink(true);
              setTimeout(() => {
                setShareLink(false);
              }, 2000);
            }}
          >
            <FaShare className="text-lg text-slate-500" />
          </div>
          {shareLink && (
            <p
              className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400
          bg-white rounded-md z-10 p-2"
            >
              {" "}
              Link copied!
            </p>
          )}

          {/* body */}
          <div
            className="w-full m-4 max-w-6xl mx-auto  bg-white shadow-md hover:shadow-xl flex flex-col justify-between 
           md:flex-row p-4 rounded-lg border-3 lg:space-x-5"
          >
            {/* right */}
            <div className=" w-full ">
              <p className="text-2xl font-bold">
                {listing.name} -$
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" ? "/Month" : ""}
              </p>
              <p className="flex items-center gap-2 mt-2 text-sm font-semibold">
                <FaMapMarkerAlt className="text-green-600" /> {listing.address}
              </p>

              <div className="flex items-center justify-start mt-2  space-x-4 w-[75%]">
                <p className="bg-red-800 w-full max-w-[200px] p-1 rounded-md text-center font-semibold shadow-md text-white">
                  {listing.type === "rent" ? "Rent" : "Sale"}
                </p>

                {listing.offer && (
                  <p className="w-full max-w-[200px] bg-green-800 rounded-md text-white p-1 text-center font-semibold shadow-md">
                    ${+listing.regularPrice - +listing.discountedPrice} discount
                  </p>
                )}
              </div>

              <p className="mt-3 mb-3">
                {" "}
                <span className="font-semibold ">Description</span>-{" "}
                {listing.description}
              </p>

              <ul className="flex items-center gap-4  text-sm font-semibold mb-6">
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <FaBed />
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <FaBath />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : "1 Bath"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <FaParking />
                  {listing.FaParking ? "Parking Spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <FaChair />
                  {listing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>

              {listing.userRef !== auth.currentUser?.uid && !showContact && (
                <div className="mt-6">
                  <button
                    className="bg-blue-600 w-full px-7 py-3 text-white font-medium text-sm uppercase rounded shadow-md 
                  hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg text-center transition duration-150
                  ease-in-out"
                    onClick={() => setShowContact(true)}
                  >
                    Contact Landlord
                  </button>
                </div>
              )}

              {showContact && (
                <Contact userRef={listing.userRef} listing={listing} />
              )}
            </div>

            {/* left */}
            <div className="bg-pink-600 h-[200px] w-full md:h-[400px] mt-6 z-10 overflow-x-hidden">
              <MapContainer
                center={[position.lat, position.long]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[position.lat, position.long]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
