/**
 * Pronoun directive injection.
 *
 * This is the piece that makes the *model's own writing* use multiple pronouns.
 * Macros only change text we substitute; they can't make an NPC vary how it refers
 * to someone. So when an entity has two or more pronoun sets, we inject a short
 * system instruction (via setExtensionPrompt) telling the model to alternate.
 *
 * Two independent injection slots are maintained — one for the active persona and
 * one for the active character. Each is refreshed (or cleared) whenever the active
 * entity, its pronoun data, or the directive settings change.
 */

import { setExtensionPrompt, extension_prompt_types } from '../../../../../script.js';
import {
    getPersonaContainer,
    getCharacterContainer,
    formatSetsList,
    pronounsSettings,
    DIRECTIVE_OVERRIDE,
} from './pronouns.js';

const KEY_PERSONA = 'sillybunny_pronouns_persona';
const KEY_CHARACTER = 'sillybunny_pronouns_character';

/**
 * Builds the directive text for a container, or '' if it has fewer than two sets.
 * `%LIST%` in the template is replaced with the formatted pronoun sets. Any
 * `{{user}}`/`{{char}}` tokens are left intact for the core macro engine to resolve.
 * @param {string} template
 * @param {import('./pronouns.js').PronounContainer} container
 * @returns {string}
 */
export function buildDirectiveText(template, container) {
    if (!container || (container.sets?.length ?? 0) < 2) return '';
    const list = formatSetsList(container);
    if (!list) return '';
    return String(template ?? '').replace(/%LIST%/g, list);
}

/**
 * Decides whether a container's directive should be injected, honoring the
 * per-entity override on top of the global default.
 * @param {import('./pronouns.js').PronounContainer} container
 * @returns {boolean}
 */
function shouldInject(container) {
    switch (container?.directive) {
        case DIRECTIVE_OVERRIDE.ON: return true;
        case DIRECTIVE_OVERRIDE.OFF: return false;
        default: return pronounsSettings.directiveEnabled;
    }
}

/**
 * Recomputes and (re)injects both directive slots. Setting an empty value clears
 * a slot, so this both adds and removes directives as state changes.
 */
export function refreshDirectives() {
    const depth = pronounsSettings.directiveDepth;
    const role = pronounsSettings.directiveRole;

    const persona = getPersonaContainer();
    const personaText = shouldInject(persona)
        ? buildDirectiveText(pronounsSettings.directiveTemplatePersona, persona)
        : '';
    setExtensionPrompt(KEY_PERSONA, personaText, extension_prompt_types.IN_CHAT, depth, false, role);

    const character = getCharacterContainer();
    const characterText = shouldInject(character)
        ? buildDirectiveText(pronounsSettings.directiveTemplateCharacter, character)
        : '';
    setExtensionPrompt(KEY_CHARACTER, characterText, extension_prompt_types.IN_CHAT, depth, false, role);
}

/** Clears both directive slots. Used on cleanup/uninstall. */
export function clearDirectives() {
    setExtensionPrompt(KEY_PERSONA, '', extension_prompt_types.IN_CHAT, 0, false, 0);
    setExtensionPrompt(KEY_CHARACTER, '', extension_prompt_types.IN_CHAT, 0, false, 0);
}
