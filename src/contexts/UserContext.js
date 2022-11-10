// stores current user uuid(sub) in redux store

import { useEffect } from 'react';
import { useDispatch } from '../redux/store';
import { setUserIdAndToken } from '../redux/slices/user';

export default function UserContext() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserIdAndToken());
  }, [dispatch]);

  return null;
}
