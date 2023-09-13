import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

import SwiperCore from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  SwiperCore.use([Autoplay, Navigation, Pagination, EffectFade]);

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      // this is like a normal query in Mongo

      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchListings();
    // console.log(listings);
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]} ) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relative w-full overflow-hidden h-[300px] "
              ></div>

              <p
                className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg 
              opacity-90 p-2 rounded-br-3xl"
              >
                {data.name}
              </p>
              <p
                className="text-[#f1faee] absolute left-1 bottom-1 font-medium max-w-[90%] bg-[#e63946] shadow-lg 
              opacity-90 p-2 rounded-tr-3xl"
              >
                $
                {data.discountedPrice ??
                  data.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {data.type === "rent" && "/month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
