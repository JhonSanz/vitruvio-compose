export default function convertObject(input) {
  // Verifica que el objeto tenga la propiedad 'relation'
  if (!input) {
      throw new Error("El objeto de entrada debe tener la propiedad 'relation'");
  }

  // Convierte las propiedades del objeto 'relation' en un array de objetos con 'name' y 'value'
  const params = Object.entries(input).map(([key, value]) => ({
      name: key,
      value: value
  }));

  // Devuelve el objeto en el formato deseado
  return { params };
}