test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

afterEach(async () => {
    await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
    });
});

test("/postNote - Post a note", async () => {
  const postNoteRes = await postNote();

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    const response = await fetch(`${SERVER_URL}/getAllNotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    expect(response.status).toBe(200);
    expect((await response.json()).response.length).toBe(0);
});
  
test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    for (let i = 0; i < 2; i++) {
        await postNote();
    }
    const response = await fetch(`${SERVER_URL}/getAllNotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    let jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse.response.length).toBe(2)
});
  
test("/deleteNote - Delete a note", async () => {
    const postNoteRes = await postNote();
    const postNoteResJson = await postNoteRes.json();

    const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteResJson.insertedId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const deleteNoteJson = await deleteNoteRes.json();

    expect(deleteNoteRes.status).toBe(200);
    expect(deleteNoteJson.response).toBe(`Document with ID ${postNoteResJson.insertedId} deleted.`);
});
  
test("/patchNote - Patch with content and title", async () => {
    const postNoteRes = await postNote();
    const postJson = await postNoteRes.json();

    const newTitle = "NoteTitleTestUpdated";
    const newContent = "NoteTitleContentUpdated";

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postJson.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: newTitle,
            content: newContent,
        }),
    });

    const patchNoteJson = await patchNoteRes.json();

    expect(patchNoteRes.status).toBe(200);
    expect(patchNoteJson.response).toBe(`Document with ID ${postJson.insertedId} patched.`);
});
  
test("/patchNote - Patch with just title", async () => {
    const postNoteRes = await postNote();
    let postJson = await postNoteRes.json()

    const newTitle = "NoteTitleTestUpdated";

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postJson.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: newTitle,
        }),
    });

    const patchNoteJson = await patchNoteRes.json();

    expect(patchNoteRes.status).toBe(200);
    expect(patchNoteJson.response).toBe(`Document with ID ${postJson.insertedId} patched.`);
});
  
test("/patchNote - Patch with just content", async () => {
    const postNoteRes = await postNote();
    let postJson = await postNoteRes.json();

    const newContent = "NoteContentTestUpdated";

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postJson.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: newContent,
        }),
    });

    const patchNoteJson = await patchNoteRes.json();

    expect(patchNoteRes.status).toBe(200);
    expect(patchNoteJson.response).toBe(`Document with ID ${postJson.insertedId} patched.`);
});
  
test("/deleteAllNotes - Delete one note", async () => {
    await postNote();

    const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let deleteJson = await deleteAllNotesRes.json();

    expect(deleteAllNotesRes.status).toBe(200);
    expect(deleteJson.response).toBe(`1 note(s) deleted.`);
});
  
test("/deleteAllNotes - Delete three notes", async () => {
    for (let i = 0; i < 3; i++) {
        await postNote();
    }

    const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let deleteJson = await deleteAllNotesRes.json();

    expect(deleteAllNotesRes.status).toBe(200);
    expect(deleteJson.response).toBe(`3 note(s) deleted.`);
});
  
test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    const postNoteRes = await postNote();
    let postJson = await postNoteRes.json();

    const updateColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${postJson.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            color: 'red',
        }),
    });

    const updateColorJson = await updateColorRes.json();

    expect(updateColorRes.status).toBe(200);
    expect(updateColorJson.message).toBe('Note color updated successfully.');
});

const postNote = async () => {
    const title = "NoteTitleTest";
    const content = "NoteTitleContent";

    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });
    return postNoteRes;
}