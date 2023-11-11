import _ from 'lodash';
import { useCallback } from 'react';
import { useMutation } from 'react-query';

const useDebounceMutation = ({delay, ...rest}:any) => {
    const activeMutation = useMutation(rest)

  const debounce = useCallback(_.debounce(activeMutation.mutate, delay), [])

  return {...activeMutation, mutate: async (values: any) => { debounce(values) }}
};

export default useDebounceMutation