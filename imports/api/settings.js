import { Mongo } from 'meteor/mongo';
 
export const Settings_DB = new Mongo.Collection('settings');

/*Beinhaltet die Prioritäten der einzelnen Dimensionen (für jeden Nutzer ein Eintrag)
 Werte: _id, username, p_d, e, a, f, v_f, g_v
*/