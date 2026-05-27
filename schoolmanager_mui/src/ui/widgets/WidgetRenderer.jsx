import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/**
 * UI-only placeholder renderer for widgets.
 *
 * @param {{ widget: { id?: unknown; title?: unknown } }} props
 */
export default function WidgetRenderer(props) {
  const { widget } = props;
  const id = String(widget?.id ?? "unknown-widget");
  const title = String(widget?.title ?? "Widget");

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={0.25}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {id}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

