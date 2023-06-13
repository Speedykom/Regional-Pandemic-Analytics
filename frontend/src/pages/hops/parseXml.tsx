import React, { useEffect, useState } from "react";
import xml2js from "xml2js";

const ParseXml = ({ xmlData }: any) => {
  const [data, setData] = useState();

  useEffect(() => {
    let parser = new xml2js.Parser();
    parser.parseString(xmlData, function (err: any, result: any) {
      setData(result.info);
    });
  }, [xmlData]);

  return (
    <div>
      <table>
        {data &&
          Object.entries(data)?.map(([key, value]: any, index: number) => (
            <tr key={index} className="text-gray-300">
              <td className="text-cyan-500 font-bold">{key}:</td>
              <td className="text-gray-400">{value}</td>
            </tr>
          ))}
      </table>
    </div>
  );
};

export default ParseXml;
