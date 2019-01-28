'use strict';
import { CancellationTokenSource, QuickPickOptions, window } from 'vscode';
import { Container } from '../container';
import { GitLog } from '../git/gitService';
import { KeyNoopCommand } from '../keyboard';
import { Iterables } from '../system';
import {
    CommandQuickPickItem,
    CommitQuickPickItem,
    getQuickPickIgnoreFocusOut,
    MessageQuickPickItem,
    showQuickPickProgress
} from './commonQuickPicks';

export class CommitsQuickPick {
    static showProgress(message: string) {
        return showQuickPickProgress(message, {
            left: KeyNoopCommand,
            ',': KeyNoopCommand,
            '.': KeyNoopCommand
        });
    }

    static async show(
        log: GitLog | undefined,
        placeHolder: string,
        progressCancellation: CancellationTokenSource,
        options: {
            goBackCommand?: CommandQuickPickItem;
            showAllCommand?: CommandQuickPickItem;
            showInViewCommand?: CommandQuickPickItem;
        }
    ): Promise<CommitQuickPickItem | CommandQuickPickItem | undefined> {
        const items = ((log && [...Iterables.map(log.commits.values(), c => new CommitQuickPickItem(c))]) || [
            new MessageQuickPickItem('No results found')
        ]) as (CommitQuickPickItem | CommandQuickPickItem)[];

        if (options.showInViewCommand !== undefined) {
            items.splice(0, 0, options.showInViewCommand);
        }

        if (options.showAllCommand !== undefined) {
            items.splice(0, 0, options.showAllCommand);
        }

        if (options.goBackCommand !== undefined) {
            items.splice(0, 0, options.goBackCommand);
        }

        const toView = [
            ...Iterables.map(items, itm => {
                let commitFormattedDate: any;
                if (itm instanceof CommitQuickPickItem) {
                    const commitItm = itm as CommitQuickPickItem;
                    commitFormattedDate = commitItm.commit!.formattedDate;
                }
                return { ...itm, commitFormattedDate: commitFormattedDate };
            })
        ];
        await Container.searchEditor.updateGitLogs({ type: 'logsUpdate', msg: toView });

        if (progressCancellation.token.isCancellationRequested) return undefined;

        const scope = await Container.keyboard.beginScope({ left: options.goBackCommand });

        progressCancellation.cancel();

        await scope.dispose();
        return;
    }
}
