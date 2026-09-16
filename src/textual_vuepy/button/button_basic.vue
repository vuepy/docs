<template>
  <HBox style="height: 1fr;">
    <VBox>
      <Label label="Standard Buttons" />
      <Button label="Default" />
      <Button label="Primary!" variant="primary" />
      <Button label="Success!" variant="success" />
      <Button label="Warning!" variant="warning" />
      <Button label="Error!" variant="error" />
    </VBox>
    <VBox>
      <Label label="Disabled Buttons" />
      <Button label="Default" disabled />
      <Button label="Primary!" variant="primary" disabled />
      <Button label="Success!" variant="success" disabled />
      <Button label="Warning!" variant="warning" disabled />
      <Button label="Error!" variant="error" disabled />
    </VBox>
    <VBox>
      <Label label="Flat Buttons" />
      <Button label="Default" flat />
      <Button label="Primary!" variant="primary" flat />
      <Button label="Success!" variant="success" flat />
      <Button label="Warning!" variant="warning" flat />
      <Button label="Error!" variant="error" flat />
    </VBox>
    <VBox>
      <Label label="Disabled Flat Buttons" />
      <Button label="Default" disabled flat />
      <Button label="Primary!" variant="primary" disabled flat />
      <Button label="Success!" variant="success" disabled flat />
      <Button label="Warning!" variant="warning" disabled flat />
      <Button label="Error!" variant="error" disabled flat />
    </VBox>
  </HBox>
</template>
