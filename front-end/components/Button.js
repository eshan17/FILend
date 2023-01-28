/** @format */

export const Button = ({ text }) => {
  return (
    <button className="text-md font-medium  bg-fil-primary px-4 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
      {text}
    </button>
  );
};
