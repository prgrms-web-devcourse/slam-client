import { useAuthContext } from "@contexts/hooks";
import reservationApi from "@service/reservationApi";
import { getISOString } from "@utils/date";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useReducer, useState } from "react";
import { actionTypes } from "./actionTypes";

import ReservationContext from "./context";
import { reducer, initialData } from "./reducer";

interface Props {
  children: ReactNode;
}

const ReservationProvider = ({ children }: Props) => {
  const [reservation, dispatch] = useReducer(reducer, initialData);
  const router = useRouter();
  const {
    query: { courtId, date, timeSlot },
  } = router;

  const {
    authProps: { currentUser },
  } = useAuthContext();

  const [snap, setSnap] = useState(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    startIndex,
    endIndex,
    mode,
    step,
    timeTable,
    existedReservations,
    requestDisabled,
    selectedReservationId,
    selectedReservation,
    modalContentData,
    hasBall,
    currentInput,
  } = reservation;

  const handleSetCurrentBlock = useCallback((startIndex: number) => {
    setIsOpen(true);
    dispatch({ type: actionTypes.CLICK_BLOCK, payload: { startIndex } });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleStartCreate = useCallback(() => {
    // setIsOpen(false);
    dispatch({ type: actionTypes.START_CREATE });
  }, []);

  const handleDecreaseStep = useCallback(() => {
    setIsOpen(false);
    dispatch({ type: actionTypes.DECREASE_STEP });
  }, []);

  const handleStartUpdate = useCallback(() => {
    setIsOpen(false);
    dispatch({ type: actionTypes.START_UPDATE });
  }, []);

  const handleCreateReservation = useCallback(
    async (hasBall: boolean) => {
      if (!date || !courtId) {
        return;
      }

      const data = {
        courtId: Number(courtId),
        startTime: getISOString(date as string, startIndex),
        endTime: getISOString(date as string, endIndex + 1),
        hasBall,
      };

      try {
        await reservationApi.createReservation(data);
      } catch (error) {
        console.error(error);
      }

      router.push("/reservations");
    },
    [courtId, date, endIndex, startIndex, router]
  );

  const handleUpdateReservation = useCallback(
    async (hasBall: boolean) => {
      if (!date || !courtId) {
        return;
      }

      const data = {
        courtId: Number(courtId),
        startTime: getISOString(date as string, startIndex),
        endTime: getISOString(date as string, endIndex + 1),
        hasBall,
      };

      try {
        await reservationApi.updateReservation(selectedReservationId, data);
      } catch (error) {
        console.error(error);
      }

      router.push("/reservations");
    },
    [courtId, date, endIndex, startIndex, selectedReservationId, router]
  );

  const handleDeleteReservation = useCallback(async () => {
    try {
      await reservationApi.deleteReservation(selectedReservationId);
    } catch (error) {
      console.error(error);
    }

    router.push("/reservations");
  }, [selectedReservationId, router]);

  const handleChangeHasBall = useCallback((hasBall: boolean) => {
    dispatch({
      type: "SET_HAS_BALL",
      payload: { hasBall },
    });
  }, []);

  const handleClickReservationMarker = useCallback(
    (selectedReservationId: number) => {
      setIsOpen(true);
      dispatch({
        type: "CLICK_RESERVATION_MARKER",
        payload: { selectedReservationId },
      });
    },
    []
  );

  const handleSetCurrentInput = useCallback((currentInput: string) => {
    dispatch({
      type: "SET_CURRENT_INPUT",
      payload: { currentInput },
    });
  }, []);

  const handleSetTime = useCallback(
    (timeIndex: number) => {
      setIsOpen(true);
      dispatch({
        type: "SET_TIME_INDEX",
        payload: {
          timeIndex,
          user: {
            user: currentUser,
            avatarImgSrc: currentUser.profileImageUrl,
          },
        },
      });
    },
    [currentUser]
  );

  return (
    <ReservationContext.Provider
      value={{
        data: {},
        handleSetCurrentBlock,
        handleClose,
        handleStartCreate,
        handleStartUpdate,
        handleDecreaseStep,
        handleCreateReservation,
        handleUpdateReservation,
        handleDeleteReservation,
        handleChangeHasBall,
        handleClickReservationMarker,
        handleSetCurrentInput,
        handleSetTime,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationProvider;
