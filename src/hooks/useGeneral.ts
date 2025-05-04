export const useGeneral = () => {
  const getUniqueObjects = (array1, array2, key) => {
    const onlyInArray1 = array1.filter(
      (obj1) => !array2.some((obj2) => obj1[key] === obj2[key])
    );
    const onlyInArray2 = array2.filter(
      (obj2) => !array1.some((obj1) => obj1[key] === obj2[key])
    );
    return [...onlyInArray1, ...onlyInArray2];
  };

  return { getUniqueObjects };
};
