import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import axios from "axios";
import { Button } from "antd";
import { useState, useEffect } from "react";
import XMLViewer from "react-xml-viewer";

export default function HopDetail({ hopsData, hopTitle }: any) {
  const [newTags, setNewTags] = useState<any>();
  const [updateTags, setUpdateTags] = useState<any>();
  const [deleteTags, setDeleteTags] = useState<any>();
  const [data, setData] = useState<any>(hopsData);

  const handleAddingTags = async () => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`,
        newTags,
        {
          headers: {
            Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/json; charset=utf-8",
            // `Bearer ${token}`
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setNewTags("");
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUpdatingTags = async () => {
    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`,
        updateTags,
        {
          headers: {
            Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/json; charset=utf-8",
            // `Bearer ${token}`
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setUpdateTags("");
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeletingTags = async () => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`, {
        headers: {
          Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
          "Content-Type": "application/json; charset=utf-8",
          // `Bearer ${token}`
        },
        data: {
          tags: deleteTags.split(","),
        },
      })
      .then((res) => {
        if (res.data) {
          setDeleteTags("");
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const customTheme = {
    separatorColor: "#087757",
    tagColor: "red",
    textColor: "#FFFFFF",
  };

  return (
    <DashboardFrame title="Hop Details">
      <section className="flex space-x-2 h-auto">
        <div className="w-1/2 h-[35rem] bg-gray-800 overflow-y-auto p-4">
          <XMLViewer
            xml={data}
            indentSize={5}
            collapsible
            theme={customTheme}
            overflowBreak
          />
        </div>

        <section className="w-1/2 bg-blue-50 p-4">
          {/* add new tags section */}
          <div>
            <p className="text mb-2">Add New Tags</p>
            <textarea
              className="w-full h-32 min-h-20 max-h-32"
              value={newTags}
              onChange={(e: any) => setNewTags(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="primary"
                className="flex items-center"
                style={{
                  backgroundColor: "#087757",
                  border: "1px solid #e65e01",
                }}
                onClick={handleAddingTags}
                disabled={newTags ? false : true}
              >
                Add Tags
              </Button>
            </div>
          </div>

          {/* edit tags section */}
          <div>
            <p className="text mb-2">Edit Tags</p>
            <textarea
              className="w-full h-32 min-h-20 max-h-32"
              value={updateTags}
              onChange={(e: any) => setUpdateTags(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="primary"
                className="flex items-center"
                style={{
                  backgroundColor: "#FFBF00",
                }}
                onClick={handleUpdatingTags}
                disabled={updateTags ? false : true}
              >
                Update Tags
              </Button>
            </div>
          </div>

          {/* delete tags section */}
          <div>
            <p className="text mb-2">Delete Tags</p>
            <textarea
              className="w-full h-20 min-h-20 max-h-20"
              value={deleteTags}
              onChange={(e: any) => setDeleteTags(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="primary"
                className="flex items-center"
                style={{
                  backgroundColor: "#FF0000",
                  border: "1px solid #e65e01",
                }}
                onClick={handleDeletingTags}
                disabled={deleteTags ? false : true}
              >
                Delete Tags
              </Button>
            </div>
          </div>
        </section>
      </section>
    </DashboardFrame>
  );
}

// export async function getStaticPaths() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/`, {
//     headers: {
//       Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
//       "Content-Type": "application/xml; charset=utf-8",
//       // `Bearer ${token}`
//     },
//   });
//   const users = await res.json();
//   console.log(users);
//   // const paths = users.map((user: any) => ({
//   //   params: { title: user.name.toString() },
//   // }));

//   return { paths: "ljkh", fallback: false };
// }

export async function getServerSideProps({ params }: any) {
  let results;
  await axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${params.title}`, {
      headers: {
        Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
        "Content-Type": "application/xml; charset=utf-8",
        // `Bearer ${token}`
      },
    })
    .then((res) => {
      if (res.data) {
        results = res.data;
      }
    })
    .catch((err) => console.log(err));

  return {
    props: {
      hopsData: results,
      hopTitle: params.title,
    },
  };
}
