export const EditHopProcess = () => {
  console.log(process.env.NEXT_PUBLIC_HOP_UI);
  
  return (
    <div>
      <iframe style={{height: "700px", width: "100%"}} src={process.env.NEXT_PUBLIC_HOP_UI} />
    </div>
  );
};
