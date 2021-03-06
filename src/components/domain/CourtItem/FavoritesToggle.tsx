import { useCallback, useMemo } from "react";

import { IconToggle } from "@components/base";
import { useAuthContext } from "@contexts/hooks";

interface Props {
  courtId: number;
}

const FavoritesToggle: React.FC<Props> = ({ courtId }) => {
  const {
    authProps: {
      currentUser: { favorites },
    },
    createFavorite,
    deleteFavorite,
  } = useAuthContext();

  const isChecked = favorites.some((favorite) => favorite.courtId === courtId);

  const handleToggleFavorite = useCallback(() => {
    if (isChecked) {
      const deletingFavorite = favorites.find(
        (favorite) => favorite.courtId === courtId
      );
      if (deletingFavorite) {
        deleteFavorite(deletingFavorite.favoriteId);
      }
    } else {
      createFavorite(courtId);
    }
  }, [isChecked, courtId, createFavorite, deleteFavorite, favorites]);

  return (
    <IconToggle
      name="star"
      checked={isChecked}
      onChange={handleToggleFavorite}
    />
  );
};

export default FavoritesToggle;
