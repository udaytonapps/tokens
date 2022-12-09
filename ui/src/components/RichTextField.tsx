import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./RichTextField.scss";

interface RichTextFieldProps {
  control: Control<any, any>;
  fieldKey: string;
  fieldValue?: string;
}

/** Show settings instructions */
function RichTextField(props: RichTextFieldProps) {
  const { control, fieldKey, fieldValue } = props;

  const [editorState, setEditorState] = useState<EditorState>();

  useEffect(() => {
    if (fieldValue) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(fieldValue)))
      );
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [fieldValue]);

  const onChange = (
    editorState: EditorState,
    field: ControllerRenderProps<FieldValues, typeof fieldKey>
  ) => {
    field.onChange(
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    setEditorState(editorState);
  };

  return (
    <Box>
      {control && editorState && (
        <Controller
          name={fieldKey}
          control={control}
          render={({ field }) => (
            <Editor
              editorState={editorState}
              editorStyle={{
                border: "1px solid lightGray",
                borderRadius: "5px",
                padding: "15px",
              }}
              toolbar={{
                options: [
                  "inline",
                  // "blockType",
                  // "fontSize",
                  // "fontFamily",
                  "list",
                  "textAlign",
                  // "colorPicker",
                  // "link",
                  // "embedded",
                  // "emoji",
                  // "image",
                  "remove",
                  "history",
                ],
              }}
              onEditorStateChange={(editorState) =>
                onChange(editorState, field)
              }
            />
          )}
        />
      )}
    </Box>
  );
}

export default RichTextField;
