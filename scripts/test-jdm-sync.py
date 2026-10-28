"""Check deployment arguments and failure handling without connecting to JDM."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('jdm-sync.sh').resolve()

class SyncTest(unittest.TestCase):
    def run_sync(self, mode, mismatch=False):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'deployment/jdm-public'
            source.mkdir(parents=True)
            for name in ('index.html', 'kontakt.html', 'sitemap.xml'):
                (source / name).write_text('fixture')
            commands = root / 'bin'
            commands.mkdir()
            # Avoid touching SSH configuration or launching any network command.
            for name in ('mkdir', 'chmod'):
                path = commands / name
                path.write_text('#!/bin/sh\nexit 0\n')
                path.chmod(0o755)
            rsync = commands / 'rsync'
            rsync.write_text('''#!/usr/bin/env python3
import json, os, sys
with open(os.environ['JDM_TEST_CALLS'], 'a') as output:
    output.write(json.dumps(sys.argv[1:]) + '\\n')
if os.environ.get('JDM_TEST_MISMATCH') == '1' and '--dry-run' in sys.argv:
    print('<fcsT...... index.html')
''')
            rsync.chmod(0o755)
            calls_file = root / 'calls'
            env = dict(os.environ, PATH=str(commands) + ':' + os.environ['PATH'],
                       SSHPASS='non-secret-test-value', JDM_MODE=mode,
                       JDM_TEST_CALLS=str(calls_file), JDM_TEST_MISMATCH=str(int(mismatch)))
            result = subprocess.run(['bash', str(SCRIPT)], cwd=root, env=env, capture_output=True, text=True)
            calls = [json.loads(line) for line in calls_file.read_text().splitlines()]
            return result, calls

    def test_safe_modes_and_whole_file_regression(self):
        for mode, count in [('compare', 3), ('deploy', 4)]:
            result, calls = self.run_sync(mode)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(len(calls), count)
            for args in calls:
                for required in ('--whole-file', '--checksum', '--checksum-choice=md5',
                                 '--exclude=private-config/', '--exclude=*.php', '--exclude=/vendor/'):
                    self.assertIn(required, args)
                self.assertNotIn('--delete', args)
            self.assertTrue(all('--dry-run' in args for args in calls) if mode == 'compare'
                            else '--dry-run' in calls[-1])
            self.assertEqual(calls[2][-2], 'deployment/jdm-public/sitemap.xml')

    def test_post_upload_difference_is_failure(self):
        result, _ = self.run_sync('deploy', mismatch=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('verification found differences', result.stderr)

if __name__ == '__main__':
    unittest.main()
