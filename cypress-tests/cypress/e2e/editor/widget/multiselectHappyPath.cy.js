import { multiselectSelector } from "Selectors/multiselect";
import { multiselectText } from "Texts/multiselect";
import {
  commonText,
  commonWidgetText,
  codeMirrorInputLabel,
} from "Texts/common";
import { commonSelectors, commonWidgetSelector } from "Selectors/common";
import { fake } from "Fixtures/fake";

import {
  verifyMultiselectHeader,
  selectFromMultiSelect,
  verifyMultiselectStatus,
  verifyMultiselectOptions,
} from "Support/utils/multiselectWidget";
import {
  openAccordion,
  verifyAndModifyParameter,
  openEditorSidebar,
  verifyAndModifyToggleFx,
  addDefaultEventHandler,
  addAndVerifyTooltip,
  editAndVerifyWidgetName,
  verifyMultipleComponentValuesFromInspector,
  selectColourFromColourPicker,
  fillBoxShadowParams,
  verifyBoxShadowCss,
  addTextWidgetToVerifyValue,
  verifyTooltip,
} from "Support/utils/commonWidget";

describe("Multiselect widget", () => {
  beforeEach(() => {
    cy.appUILogin();
    cy.createApp();
    cy.dragAndDropWidget(multiselectText.multiselect);
  });

  it("should verify the properties of the widget", () => {
    const data = {};
    data.widgetName = fake.widgetName;
    data.label = fake.widgetName;
    data.customMessage = fake.randomSentence;
    data.alertMessage = fake.randomSentence;
    data.randomLabels = multiselectSelector.textArrayOfLength(3);

    openEditorSidebar(multiselectText.defaultWidgetName);
    editAndVerifyWidgetName(data.widgetName);

    openAccordion(commonWidgetText.accordionProperties);
    verifyAndModifyParameter(commonWidgetText.parameterLabel, data.label);
    cy.get(commonWidgetSelector.buttonCloseEditorSideBar).click();
    cy.get(multiselectSelector.multiselectLabel(data.widgetName)).should(
      "have.text",
      data.label
    );

    openEditorSidebar(data.widgetName);
    verifyAndModifyParameter(
      commonWidgetText.labelDefaultValue,
      codeMirrorInputLabel("[1,2,3]")
    );
    cy.get(commonWidgetSelector.buttonCloseEditorSideBar).click();
    verifyMultiselectHeader(
      data.widgetName,
      multiselectText.labelAllItemsSelected
    );
    verifyMultipleComponentValuesFromInspector(data.widgetName, [1, 2, 3]);

    openEditorSidebar(data.widgetName);
    verifyAndModifyParameter(
      commonWidgetText.labelDefaultValue,
      codeMirrorInputLabel("[1,2]")
    );
    verifyMultipleComponentValuesFromInspector(
      data.widgetName,
      [1, 2],
      "opened"
    );

    verifyMultiselectHeader(data.widgetName, "one, two");
    verifyMultiselectStatus(data.widgetName);
    verifyMultiselectOptions(data.widgetName);

    selectFromMultiSelect(data.widgetName, ["", "", "true"]);
    verifyMultiselectStatus(data.widgetName, ["", "", ""]);
    verifyMultiselectHeader(
      data.widgetName,
      multiselectText.labelAllItemsSelected
    );

    verifyMultipleComponentValuesFromInspector(
      data.widgetName,
      [1, 2, 3],
      "opened"
    );

    openEditorSidebar(data.widgetName);
    verifyAndModifyParameter(
      commonWidgetText.parameterOptionvalues,
      codeMirrorInputLabel(`[${data.randomLabels}]`)
    );
    selectFromMultiSelect(data.widgetName, ["true", "true", "true"]);

    verifyMultipleComponentValuesFromInspector(
      data.widgetName,
      data.randomLabels,
      "opened"
    );

    openEditorSidebar(data.widgetName);
    data.randomLabels = multiselectSelector.textArrayOfLength(3);
    verifyAndModifyParameter(
      commonWidgetText.parameterOptionLabels,
      codeMirrorInputLabel(`[${data.randomLabels}]`)
    );
    verifyMultiselectOptions(data.widgetName, data.randomLabels);

    openEditorSidebar(data.widgetName);
    verifyAndModifyToggleFx(multiselectText.enableSelectAllOptions);

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName))
      .find(multiselectSelector.multiselectHeader)
      .click();
    cy.get(multiselectSelector.dropdownAllItems)
      .first()
      .should("have.text", multiselectText.dropdwonOptionSelectAll)
      .click()
      .click();

    verifyMultiselectHeader(
      data.widgetName,
      multiselectText.labelAllItemsSelected
    );

    openEditorSidebar(data.widgetName);
    openAccordion(commonWidgetText.accordionEvents);
    cy.get(commonWidgetSelector.noEventHandlerMessage).should(
      "have.text",
      multiselectText.noEventsMessage
    );
    addDefaultEventHandler(data.alertMessage);
    cy.get(commonWidgetSelector.buttonCloseEditorSideBar).click();

    selectFromMultiSelect(data.widgetName, ["", "", "true"]);
    cy.verifyToastMessage(commonSelectors.toastMessage, data.alertMessage);

    openEditorSidebar(data.widgetName);
    openAccordion(commonWidgetText.accordionGenaral);
    addAndVerifyTooltip(
      commonWidgetSelector.draggableWidget(data.widgetName),
      fake.randomSentence
    );

    openEditorSidebar(data.widgetName);
    openAccordion(commonWidgetText.accordionLayout);
    verifyAndModifyToggleFx(
      commonWidgetText.parameterShowOnDesktop,
      commonWidgetText.codeMirrorLabelTrue
    );
    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).should(
      "not.exist"
    );

    verifyAndModifyToggleFx(
      commonWidgetText.parameterShowOnMobile,
      commonWidgetText.codeMirrorLabelFalse
    );
    cy.get(commonWidgetSelector.changeLayoutButton).click();
    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).should(
      "exist"
    );
  });

  it("should verify the styles of the widget", () => {
    const data = {};
    data.colour = fake.randomRgba;
    data.boxShadowParam = fake.boxShadowParam;

    openEditorSidebar(multiselectText.defaultWidgetName);
    cy.get(commonWidgetSelector.buttonStylesEditorSideBar).click();

    verifyAndModifyToggleFx(
      commonWidgetText.parameterVisibility,
      commonWidgetText.codeMirrorLabelTrue
    );
    cy.get(
      commonWidgetSelector.draggableWidget(multiselectText.defaultWidgetName)
    ).should("not.be.visible");
    cy.get(
      commonWidgetSelector.parameterTogglebutton(
        commonWidgetText.parameterVisibility
      )
    ).click();
    verifyAndModifyToggleFx(
      commonWidgetText.parameterDisable,
      commonWidgetText.codeMirrorLabelFalse
    );
    cy.get(commonSelectors.autoSave, { timeout: 9000 }).should(
      "have.text",
      commonText.autoSave
    );
    cy.get(
      commonWidgetSelector.draggableWidget(multiselectText.defaultWidgetName)
    )
      .find(multiselectSelector.dropdownContainer)
      .should("have.attr", "aria-disabled", "true");

    verifyAndModifyParameter(
      commonWidgetText.parameterBorderRadius,
      commonWidgetText.borderRadiusInput
    );
    cy.get(commonWidgetSelector.buttonCloseEditorSideBar).click();
    cy.get(
      commonWidgetSelector.draggableWidget(multiselectText.defaultWidgetName)
    )
      .children(".h-100")
      .should("have.css", "border-radius", "20px");

    openEditorSidebar(multiselectText.defaultWidgetName);
    cy.get(commonWidgetSelector.buttonStylesEditorSideBar).click();
    openAccordion(commonWidgetText.accordionGenaral, "1");

    verifyAndModifyToggleFx(
      commonWidgetText.parameterBoxShadow,
      commonWidgetText.boxShadowDefaultValue,
      false
    );
    cy.get(multiselectSelector.inputBoxShadow).click();
    fillBoxShadowParams(
      commonWidgetSelector.boxShadowDefaultParam,
      data.boxShadowParam
    );
    cy.get(multiselectSelector.boxShadowPopover)
      .find(multiselectSelector.colourPickerInput)
      .click();
    selectColourFromColourPicker(
      multiselectSelector.colourPickerParent,
      data.colour
    );
    verifyBoxShadowCss(
      multiselectText.defaultWidgetName,
      data.colour,
      data.boxShadowParam
    );
  });

  it("should verify widget in preview", () => {
    const data = {};
    data.widgetName = fake.widgetName;
    data.label = fake.widgetName;
    data.customMessage = fake.randomSentence;
    data.alertMessage = fake.randomSentence;
    data.colour = fake.randomRgba;
    data.boxShadowParam = fake.boxShadowParam;
    data.randomLabels = multiselectSelector.textArrayOfLength(3);
    data.randomValues = multiselectSelector.textArrayOfLength(3);

    openEditorSidebar(multiselectText.defaultWidgetName);
    editAndVerifyWidgetName(data.widgetName);
    verifyAndModifyParameter(commonWidgetText.parameterLabel, data.label);
    verifyAndModifyParameter(
      commonWidgetText.labelDefaultValue,
      codeMirrorInputLabel(`[${data.randomValues[0]}]`)
    );

    verifyAndModifyToggleFx(multiselectText.enableSelectAllOptions);
    verifyAndModifyParameter(
      commonWidgetText.parameterOptionvalues,
      codeMirrorInputLabel(`[${data.randomValues}]`)
    );

    openAccordion(commonWidgetText.accordionEvents);
    addDefaultEventHandler(data.alertMessage);

    openAccordion(commonWidgetText.accordionGenaral);
    addAndVerifyTooltip(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.customMessage
    );

    openEditorSidebar(data.widgetName);
    cy.get(commonWidgetSelector.buttonStylesEditorSideBar).click();
    openAccordion(commonWidgetText.accordionGenaral, "1");
    cy.get(multiselectSelector.inputBoxShadow).click();

    fillBoxShadowParams(
      commonWidgetSelector.boxShadowDefaultParam,
      data.boxShadowParam
    );
    cy.get(multiselectSelector.boxShadowPopover)
      .find(multiselectSelector.colourPickerInput)
      .click();
    selectColourFromColourPicker(
      multiselectSelector.colourPickerParent,
      data.colour
    );
    verifyAndModifyParameter(
      commonWidgetText.parameterBorderRadius,
      commonWidgetText.borderRadiusInput
    );

    addTextWidgetToVerifyValue(`components.${data.widgetName}.values`);

    cy.openInCurrentTab(`[data-cy="preview-link-button"]`);
    //investigate on default value

    cy.get(multiselectSelector.multiselectLabel(data.widgetName)).should(
      "have.text",
      `${data.label}`
    );

    verifyMultiselectOptions(data.widgetName, [
      "Select All",
      "one",
      "two",
      "three",
    ]);

    cy.get("[data-cy='draggable-widget-text1']").should(
      "have.text",
      `${data.randomValues[0].replaceAll('"', "")}`
    );
    selectFromMultiSelect(data.widgetName, ["", "", "true"]);
    cy.verifyToastMessage(commonSelectors.toastMessage, data.alertMessage);
    //alert

    cy.get("[data-cy='draggable-widget-text1']").should(
      "have.text",
      `${data.randomValues.slice(0, 2)}`.replaceAll('"', "")
    );

    selectFromMultiSelect(data.widgetName, ["true"]);
    cy.get("[data-cy='draggable-widget-text1']").should(
      "have.text",
      `${data.randomValues}`.replaceAll('"', "")
    );
    verifyMultiselectHeader(
      data.widgetName,
      multiselectText.labelAllItemsSelected
    );

    verifyTooltip(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.customMessage
    );
    cy.get(commonWidgetSelector.draggableWidget(data.widgetName))
      .children(".h-100")
      .should("have.css", "border-radius", "20px");

    verifyBoxShadowCss(data.widgetName, data.colour, data.boxShadowParam);
  });
});
