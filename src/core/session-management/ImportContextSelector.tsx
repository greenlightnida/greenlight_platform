import { Users, GraduationCap, UserPlus, Upload } from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { 
  ImportType, 
  EntryPoint, 
  ImportContext 
} from '../../types';

interface ImportContextSelectorProps {
  onContextChange: (context: ImportContext) => void;
  initialContext?: Partial<ImportContext>;
}

export const ImportContextSelector: React.FC<ImportContextSelectorProps> = ({
  onContextChange,
  initialContext
}) => {
  const [context, setContext] = useState<ImportContext>({
    importType: initialContext?.importType ?? 'coach_recruitment',
    entryPoint: initialContext?.entryPoint ?? 'coach_referral',
    sourceCoach: initialContext?.sourceCoach ?? '',
    sourceProgram: initialContext?.sourceProgram ?? '',
    notes: initialContext?.notes ?? ''
  });

  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showCoachDetails, setShowCoachDetails] = useState(false);

  const handleContextChange = useCallback((updates: Partial<ImportContext>) => {
    const newContext = { ...context, ...updates };
    setContext(newContext);
    onContextChange(newContext);
  }, [context, onContextChange]);

  const importTypeOptions = [
    {
      value: 'coach_recruitment' as ImportType,
      label: 'Coach Recruitment',
      description: 'Players recruited by external coaches or partners',
      icon: Users,
      color: 'blue'
    },
    {
      value: 'company_program' as ImportType,
      label: 'Company Program',
      description: 'Players from our own camps, training, or development programs',
      icon: GraduationCap,
      color: 'green'
    },
    {
      value: 'manual_entry' as ImportType,
      label: 'Manual Entry',
      description: 'Individual players entered manually',
      icon: UserPlus,
      color: 'purple'
    },
    {
      value: 'bulk_import' as ImportType,
      label: 'Bulk Import',
      description: 'General bulk data import',
      icon: Upload,
      color: 'gray'
    }
  ];

  const entryPointOptions = [
    {
      value: 'coach_referral' as EntryPoint,
      label: 'Coach Referral',
      description: 'Referred by a coach or partner'
    },
    {
      value: 'marketing_campaign' as EntryPoint,
      label: 'Marketing Campaign',
      description: 'Came through marketing efforts'
    },
    {
      value: 'direct_registration' as EntryPoint,
      label: 'Direct Registration',
      description: 'Registered directly on our platform'
    },
    {
      value: 'partner_program' as EntryPoint,
      label: 'Partner Program',
      description: 'From a partner organization'
    },
    {
      value: 'internal_development' as EntryPoint,
      label: 'Internal Development',
      description: 'Developed internally by our team'
    }
  ];

  const programTypeOptions = [
    { value: 'camp', label: 'Camp' },
    { value: 'training', label: 'Training Program' },
    { value: 'tryout', label: 'Tryout' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'development', label: 'Development Program' }
  ];

  const relationshipTypeOptions = [
    { value: 'partner', label: 'Partner Coach' },
    { value: 'independent', label: 'Independent Coach' },
    { value: 'staff', label: 'Staff Coach' },
    { value: 'volunteer', label: 'Volunteer Coach' }
  ];

  return (
    <div className="space-y-6">
      {/* Import Type Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {importTypeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleContextChange({ importType: option.value })}
                className={`p-4 border rounded-lg text-left transition-all ${
                  context.importType === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-6 w-6 text-${option.color}-600`} />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Entry Point Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Entry Point</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entryPointOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleContextChange({ entryPoint: option.value })}
              className={`p-3 border rounded-md text-left transition-all ${
                context.entryPoint === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Source Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Source Information</h3>
        
        {/* Coach Information */}
        {(context.importType === 'coach_recruitment' || context.entryPoint === 'coach_referral') && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Coach Information</h4>
              <button
                onClick={() => setShowCoachDetails(!showCoachDetails)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showCoachDetails ? 'Hide Details' : 'Add Details'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-1">
                  Coach Name *
                </label>
                <input
                  id="coachName"
                  type="text"
                  value={context.sourceCoach ?? ''}
                  onChange={(e) => handleContextChange({ sourceCoach: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter coach name"
                />
              </div>

              {showCoachDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input
                      id="organization"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Coach's organization"
                    />
                  </div>
                  <div>
                    <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship Type
                    </label>
                    <select id="relationshipType" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {relationshipTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="coachEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="coachEmail"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="coach@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="coachPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="coachPhone"
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Program Information */}
        {context.importType === 'company_program' && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Program Information</h4>
              <button
                onClick={() => setShowProgramDetails(!showProgramDetails)}
                className="text-sm text-green-600 hover:text-green-700"
              >
                {showProgramDetails ? 'Hide Details' : 'Add Details'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name *
                </label>
                <input
                  id="programName"
                  type="text"
                  value={context.sourceProgram ?? ''}
                  onChange={(e) => handleContextChange({ sourceProgram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter program name"
                />
              </div>

              {showProgramDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="programType" className="block text-sm font-medium text-gray-700 mb-1">
                      Program Type
                    </label>
                    <select id="programType" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      {programTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="programLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      id="programLocation"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Program location"
                    />
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      id="capacity"
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Maximum participants"
                    />
                  </div>
                  <div>
                    <label htmlFor="currentEnrollment" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Enrollment
                    </label>
                    <input
                      id="currentEnrollment"
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Current participants"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Marketing Campaign */}
        {context.entryPoint === 'marketing_campaign' && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Marketing Campaign</h4>
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                id="campaignName"
                type="text"
                value={context.marketingCampaign ?? ''}
                onChange={(e) => handleContextChange({ marketingCampaign: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Summer 2024 Social Media Campaign"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          value={context.notes ?? ''}
          onChange={(e) => handleContextChange({ notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional context about this import..."
        />
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Import Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Type:</strong> {importTypeOptions.find(o => o.value === context.importType)?.label}</div>
          <div><strong>Entry Point:</strong> {entryPointOptions.find(o => o.value === context.entryPoint)?.label}</div>
          {context.sourceCoach && context.sourceCoach.trim() !== '' && <div><strong>Source Coach:</strong> {context.sourceCoach}</div>}
          {context.sourceProgram && context.sourceProgram.trim() !== '' && <div><strong>Source Program:</strong> {context.sourceProgram}</div>}
          {context.marketingCampaign && context.marketingCampaign.trim() !== '' && <div><strong>Campaign:</strong> {context.marketingCampaign}</div>}
        </div>
      </div>
    </div>
  );
}; 