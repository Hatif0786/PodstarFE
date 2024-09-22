import React, { createContext, useState } from 'react';

// Create the context
export const FavoriteAlbumContext = createContext();

// Create a provider component
export const FavoriteAlbumProvider = ({ children }) => {
  const [favouriteAlbum, setFavouriteAlbum] = useState([]);

  return (
    <FavoriteAlbumContext.Provider value={[favouriteAlbum, setFavouriteAlbum]}>
      {children}
    </FavoriteAlbumContext.Provider>
  );
};
